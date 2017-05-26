I made this as a working, out of the box, calendar for use with Nextcloud 12.

I will update this when needed by deprecated purposes or when Nextcloud changes their sabre version.

This is a fork of Kolab and FasterIT calendars combining the best of both and using the sabre from Nextcloud to work with it's version of sabre. It will sync already existing calendars. If you want more than the default, you must add calendar within Nextcloud
and then go back to Roundcube and it should be there. From Roundcube, you can add, edit and delete events and will be in sync
with Nextcloud.

This is also compatible with RCMCARDDAV 2.0.4 as I use it to sync my contacts with Nextcloud to Roundcube as well.

This was tested using Roundcube 1.3 and PHP 7.0.17.

Installation is pretty straight forward.

Copy calendar and libcalendaring folders to Roundcube Plugin folder, copy config.inc.php.dist to config.inc.php and change domain.ltd to your URL. 'These URL's are already configured for the default calendar url for Nextcloud.'

Import sql schemas located in /driver/ folders to your database.

Add "calendar" to $config['plugins'] in your Roundcube main config file and you are set.

***IMPORTANT***

Your login and password must be the same for Nextcloud and Roundcube to work properly.

Known Issues:
-------
* Will not create new calendar.
* Itip does not send reply to event organizer using RC1.3. Works in RC1.2.4.
* ~~Recurring events marked as "All Day Events" will be a day early the following years.~~ Fixed!!!!
* ~~Database driver does not work. Birthdays are the issue due to being all day.~~ Fixed!!!

User Discovered Issues:
-------
* ~~Check Calendar shows Error 500.~~ Fixed!!!!

If anyone would like to help out to make oauth work and other features, I would appreciate it.

TODO:
-------
* Ability to add new calendar to Nextcloud from Roundcube Calendar GUI.
* Oauth support. (In progress)
* Assign random colors to autodiscover calendars.
* Remove mcrypt and replace with openssl

Random Color Quickie:
-------
* Multiple Calendars saved with same color. (Import into database `UPDATE caldav_calendars SET color = substring(MD5(RAND()), -6);` to assign radmon colors after initial sync of calendars)
