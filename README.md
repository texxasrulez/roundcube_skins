# Roundcube_Skins
I have taken Larry skin and modified it so there are more theme colors to choose from. Larry Skin has the best layout of all other themes in my opinion, so why reinvent the wheel when all I want is a wider color choice.

I have also included skins for many popular plugins (or the ones I use) so you shouldn't have to make your own. If you need help with a plugin not available with this, please message me and ask. I just might can help you out ... 

The Larry Skin from Roundcube 1.3 Beta was used, so you must be running RC 1.3 or higher.

Installation is easy. Upload plugins and skins folders to your roundcube installation root and it should copy to all appropriate file locations ... 


Enjoy!

Thumbnail Preview
-----------

![Alt text](/skins/autumn-larry/thumbnail.png?raw=true "Autumn Larry")
![Alt text](/skins/black-larry/thumbnail.png?raw=true "Black Larry")
![Alt text](/skins/blue-larry/thumbnail.png?raw=true "Blue Larry")
![Alt text](/skins/green-larry/thumbnail.png?raw=true "Green Larry")
![Alt text](/skins/pink-larry/thumbnail.png?raw=true "Pink Larry")
![Alt text](/skins/teal-larry/thumbnail.png?raw=true "Teal Larry")
![Alt text](/skins/violet-larry/thumbnail.png?raw=true "Violet Larry")


Original Author:
Larry
by FLINT / Büro für Gestaltung, Switzerland
=======
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
>>>>>>> 7d9e4f9d77331480c3876e6300d3c7354f301aab
