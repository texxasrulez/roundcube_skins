I made this as a working, out of the box, calendar for the latest version of Nextcloud.

I will update this when needed by deprecated purposes or when Nextcloud changes their sabre version.

This is a fork of Kolab and FasterIT calendars combining the best of both and using the sabre from Nextcloud to work with it's version of sabre. It will sync already existing calendars. If you want more than the default, you must add calendar within Nextcloud
and then go back to Roundcube to add it there. From Roundcube, you can add, edit and delete events and will be in sync
with Nextcloud.

This is also compatible with RCMCARDDAV as I use it to sync my contacts with Nextcloud to Roundcube as well.

Installation is pretty straight forward.

Copy calendar and libcalendaring folders to Roundcube Plugin folder, copy config.inc.php.dist to config.inc.php and change domain.ltd to your URL. 'These URL's are already configured for the default calendar url for Nextcloud.'

Import sql schemas located in /driver/ folders to your database.

Add "calendar" to $config['plugins'] in your Roundcube main config file and you are set.

***IMPORTANT***

Your login and password must be the same for Nextcloud and Roundcube to work best.

Known Issues:
-------
* Will not create new calendar.
* Recurring events marked as "All Day Events" will be a day early the following years.
* Database driver does not work. Birthdays are the issue.

If anyone would like to help out to make oauth work and other features, I would appreciate it.
