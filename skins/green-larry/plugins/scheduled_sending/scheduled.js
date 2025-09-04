/* scheduled.js - binds click handler only once; relies on inline fallback too */
(function(){
  if (window.__SS_JS_BOUND) return;
  window.__SS_JS_BOUND = true;

  function bind(){
    var btn = document.getElementById('ss-schedule-btn');
    if (!btn) return;
    var inflight = false;
    btn.addEventListener('click', function(ev){
      ev.preventDefault();
      if (inflight) return;
      inflight = true;
      setTimeout(function(){ inflight = false; }, 1200);
      // if inline binder already attached, let it do the work
      if (typeof window.__SS_BOUND !== 'undefined') return;

      var when = document.getElementById('ss-when');
      if (!when || !when.value) { if (window.rcmail) rcmail.display_message('Pick a future time', 'error'); return; }
      var d = new Date(when.value);
      /* SS: toast delay v61 */
      try {
        (function(){
          function pad(n){return (n<10?'0':'')+n}
          var dt=d;
          var localText;
          try { localText = new Intl.DateTimeFormat(undefined,{month:'short',day:'2-digit',year:'numeric',hour:'numeric',minute:'2-digit'}).format(dt); }
          catch(e){ var m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][dt.getMonth()]; localText=m+' '+pad(dt.getDate())+', '+dt.getFullYear()+' '+((dt.getHours()%12)||12)+':'+pad(dt.getMinutes())+' '+(dt.getHours()<12?'AM':'PM'); }
          window.__SS_LAST_LOCAL_TEXT = localText;
        })();
      } catch(e) {}

      if (isNaN(d.getTime()) || d.getTime() <= Date.now()) { if (window.rcmail) rcmail.display_message('Pick a future time', 'error'); return; }

      var form = document.getElementById('composeform') || btn.closest('form');
      if (!form) { if (window.rcmail) rcmail.display_message('Compose form not ready', 'error'); return; }

      var data = {};
      var f = new FormData(form);
      function copyField(name, as){ if (f.has(name)) data[as||name] = f.get(name); }
      copyField('_id'); copyField('_from'); copyField('_to'); copyField('_cc'); copyField('_bcc'); copyField('_subject'); copyField('_is_html');
      data['_schedule_at'] = when.value;
      data['_schedule_ts'] = Math.floor(d.getTime()/1000);
      data['_unlock'] = 1;
      data['_schedule_tzoffset'] = - (new Date().getTimezoneOffset());

      
/* SS: client UTC encode v57 */
try {
  if (isSched && data && typeof data === 'object') {
    var utcStr = null;
    function pad(n){ return (n<10?'0':'')+n; }
    function toUTCString(dt){
      return dt.getUTCFullYear()+'-'+pad(dt.getUTCMonth()+1)+'-'+pad(dt.getUTCDate())+' '+pad(dt.getUTCHours())+':'+pad(dt.getUTCMinutes())+':'+pad(dt.getUTCSeconds());
    }
    if (typeof data._schedule_ts === 'number' && isFinite(data._schedule_ts)) {
      var dt = new Date(data._schedule_ts * 1000); // epoch seconds (local or absolute? we treat as absolute ms since epoch)
      utcStr = toUTCString(dt);
    } else if (typeof data._schedule_at === 'string') {
      var m = (data._schedule_at+'').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
      if (m) {
        var y=+m[1], mo=+m[2]-1, d=+m[3], h=+m[4], mi=+m[5], s=m[6]?+m[6]:0;
        var dt = new Date(y,mo,d,h,mi,s,0); // interpret as local wall time
        utcStr = toUTCString(dt);
      }
    }
    if (utcStr) {
      data.scheduled_at = utcStr;
      data.scheduled_at_is_utc = 1;
    }
    // Always include tz_offset for server-side sanity
    if (typeof data.tz_offset === 'undefined') {
      data.tz_offset = (new Date()).getTimezoneOffset();
    }
  }
} catch(_){}

      if (window.rcmail && typeof rcmail.http_post === 'function') {
        // Mark compose clean to avoid discard prompt
        try{
          rcmail.env.compose_submit = true;
          rcmail.env.compose_changes = false;
          if (typeof rcmail._unsaved_changes !== 'undefined') rcmail._unsaved_changes = false;
          if (typeof rcmail.env.exit_warning !== 'undefined') rcmail.env.exit_warning = false;
        }catch(e){}
        rcmail.http_post('plugin.scheduled_sending.schedule', data);

        // After response, close compose and refresh mailbox in-app (Larry-safe)
        try{
          if (!window.__SS_RESP_BOUND) {
            window.__SS_RESP_BOUND = true;
            rcmail.addEventListener('responseafter', function(resp){
              try{
                if (resp && resp.action === 'plugin.scheduled_sending.schedule') {
                  /* SS: toast delay v61 */
                  try { var t = window.__SS_LAST_LOCAL_TEXT; if (t) rcmail.display_message('Scheduled for ' + t, 'confirmation', 8); } catch(e) {}
                  var __ss_go = function(){ try { if (rcmail.busy) rcmail.set_busy(false); if (window.parent && window.parent.rcmail) window.parent.rcmail.command('list'); else rcmail.command('list'); } catch(e) {} };
                  setTimeout(__ss_go, 1800);
                  return;
                  rcmail.env.compose_changes = false;
                  if (typeof rcmail._unsaved_changes !== 'undefined') rcmail._unsaved_changes = false;
                  if (typeof rcmail.env.exit_warning !== 'undefined') rcmail.env.exit_warning = false;
                  // Prefer compose-cancel (Larry), then list mailbox
                  if (!(rcmail.command && (rcmail.command('compose-cancel') || rcmail.command('cancel') || rcmail.command('close')))) {
                    // no-op
                  }
                  setTimeout(function(){
                    if (rcmail.list_mailbox) {
                      rcmail.list_mailbox(rcmail.env.mailbox, rcmail.env.current_page);
                    } else {
                      rcmail.command('list');
                    }
                  }, 30);
                }
              }catch(_){}
            });
          }
        }catch(_){}

        // Fallback timer in case listener does not fire
        setTimeout(function(){
          try{
            if (!(rcmail.command && (rcmail.command('compose-cancel') || rcmail.command('cancel') || rcmail.command('close')))) {}
            setTimeout(function(){
              if (rcmail.list_mailbox) {
                rcmail.list_mailbox(rcmail.env.mailbox, rcmail.env.current_page);
              } else {
                rcmail.command('list');
              }
            }, 30);
          }catch(_){}
        }, 250);
      }
    }, { once:false });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();


/* SS NAV PATCH ACTIVE v41 (http_post wrapper) */
(function(){
  try{
    if (window.rcmail && !window.__SS_WRAP_BOUND) {
      window.__SS_WRAP_BOUND = true;
      var __orig_post = rcmail.http_post;
      rcmail.http_post = function(action, data, lock){
        var isSched = (action === 'plugin.scheduled_sending.schedule');
        if (isSched) {
          /* TZ attach */

/* SS: client UTC encode */
try {
  if (isSched && data && typeof data === 'object' && typeof data.scheduled_at === 'string') {
    var m = (data.scheduled_at+'').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (m) {
      var y=+m[1], mo=+m[2]-1, d=+m[3], h=+m[4], mi=+m[5], s= m[6]?+m[6]:0;
      var dt = new Date(y, mo, d, h, mi, s, 0); // local wall time
      function pad(n){ return (n<10?'0':'')+n; }
      var utc = dt.getUTCFullYear()+'-'+pad(dt.getUTCMonth()+1)+'-'+pad(dt.getUTCDate())+' '+pad(dt.getUTCHours())+':'+pad(dt.getUTCMinutes())+':'+pad(dt.getUTCSeconds());
      data.scheduled_at = utc;
      data.scheduled_at_is_utc = 1;
    }
  }
} catch(_){}

          try { if (data && typeof data === 'object') data.tz_offset = (new Date()).getTimezoneOffset(); } catch(_) {}

          try{
            if (data && typeof data === 'object') data._unlock = 1;
            rcmail.env.compose_submit = true;
            rcmail.env.compose_changes = false;
            if (typeof rcmail._unsaved_changes !== 'undefined') rcmail._unsaved_changes = false;
            if (typeof rcmail.env.exit_warning !== 'undefined') rcmail.env.exit_warning = false;
            if (typeof rcmail.unload_cancel !== 'undefined') rcmail.unload_cancel = true;
            if (window.onbeforeunload) window.onbeforeunload = null;
          }catch(_){}
        }
        var ret = __orig_post.apply(rcmail, arguments);
        if (isSched) {
          setTimeout(function(){
            try{
              if (rcmail.command) {
                rcmail.command('compose-cancel') || rcmail.command('cancel') || rcmail.command('close');
              }
              setTimeout(function(){
                try{
                  if (rcmail.list_mailbox) {
                    rcmail.list_mailbox(rcmail.env.mailbox, rcmail.env.current_page);
                  } else if (rcmail.command) {
                    rcmail.command('list');
                  }
                }catch(_){}
              }, 20);
            }catch(_){}
          }, 10);
        }
        return ret;
      };
      // Console sanity check: rcmail.http_post.__ss_wrapped === true
      rcmail.http_post.__ss_wrapped = true;
    }
  }catch(_){}
})();
