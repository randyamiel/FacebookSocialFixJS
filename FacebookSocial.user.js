// ==UserScript==
// @name           Social Fixer for Facebook
// @namespace      http://userscripts.org/users/864169999
// @include        /^https?:\/\/facebook\.com\//
// @include        /^https?:\/\/[^\/]*\.facebook\.com\//
// @exclude        /^https?:\/\/[^\/]*(channel|static)[^\/]*facebook\.com\//
// @exclude        /^https?:\/\/[^\/]*facebook\.com\/.*(ai.php|morestories.php|generic.php|xti.php|plugins|connect|ajax|sound_iframe|l.php\?u)/
// @exclude        /^https?:\/\/[^\/]*\.facebook\.com\/help/
// @exclude        /^https?:\/\/[^\/]*\.facebook\.com\/support/
// @exclude        /^https?:\/\/[^\/]*\.facebook\.com\/saved/
// @exclude        /^https?:\/\/apps.facebook\.com/
// @connect        socialfixer.com
// @connect        matt-kruse.github.io
// @run-at         document-start
// @version        15.1.0
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// ==/UserScript==
/* 
Social Fixer
(c) 2009-2016 Matt Kruse
http://SocialFixer.com/
*/

// Extension API
var Extension = (function() {
	var api = {
		"storage": {
			"get":
				function(keys, defaultValue, callback, prefix) {
					// Keys can be either a single keys or an array of keys
					if (typeof keys=="string") {
						callback(GM_getValue(prefix+keys,defaultValue));
					}
					else if (typeof keys=="object" && keys.length) {
						var values = {};
						for (var i=0; i<keys.length; i++) {
							var default_value;
							if (typeof defaultValue=="object" && defaultValue.length && i<defaultValue.length) {
								default_value = defaultValue[i];
							}
							values[keys[i]] = GM_getValue(prefix+keys[i],default_value);
						}
						callback(values);
					}
					return;
				}
			,
			"set":
				function(key,val,callback, prefix) {
					setTimeout(function() {
						var ret = GM_setValue(prefix+key,val); 
						if(typeof callback=="function") { 
							callback(key,val,ret); 
						} 
					},0);
				}
		},
		"ajax":function(urlOrObject,callback) {
			var details;
			var internalCallback = function(response) {
				var headers={};
				response.responseHeaders.split(/\r?\n/).forEach(function(header) {
					var val = header.split(/\s*:\s*/,2);
					headers[ val[0].toLowerCase() ] = val[1];
				});
				callback( response.responseText,response.status,headers );
			};
			if (typeof urlOrObject=="string") {
				details = {"method":"GET","url":urlOrObject,"onload":internalCallback };
			}
			else if (urlOrObject.url) {
				details = urlOrObject;
				details.onload = internalCallback;
			}
			else {
				alert("Invalid parameter passed to Extension.ajax");
				callback(null);
			}
			GM_xmlhttpRequest(details);
		}
	};
	// Backwards compat
	api.prefs = api.storage;
	return api;
})();

GM_addStyle(`
html.sfx_notification_popup #pagelet_bluebar,
html.sfx_notification_popup #pagelet_dock,
html.sfx_notification_popup #pagelet_ego_pane,
html.sfx_notification_popup #pagelet_sidebar,
html.sfx_notification_popup #pageFooter,
html.sfx_notification_popup #sfx_badge,
html.sfx_notification_popup .UIStandardFrame_SidebarAds {
  display: none !important;
}
html.sfx_notification_popup #globalContainer,
html.sfx_notification_popup .UIStandardFrame_Container,
html.sfx_notification_popup .UIStandardFrame_Content {
  width: 98% !important;
}
html.sfx_notification_popup .uiHeader {
  margin: 0 !important;
  padding-bottom: 0 !important;
}
html.sfx_notification_popup .UIStandardFrame_Container {
  padding-top: 0 !important;
}
html.sfx_notification_popup .UIStandardFrame_Content > .fcg {
  display: none !important;
}
html.sfx_notification_popup .jewelItemNew ._33e {
  border-left: 3px solid #4080FF !important;
}
html.sfx_notification_popup li.sfx_notification_selected {
  border-left: 3px solid red;
}
html.sfx_notification_popup ._33c[data-gt*="notif_type\\":\\"like\\""][data-gt*="subtype\\":\\"comment-"] {
  opacity: .4;
}
html.sfx_notification_popup #sfx_notification_popup_header {
  border: 1px solid #aaa;
  padding: 5px;
  margin: 2px;
}
html.sfx_notification_popup #sfx_notification_popup_header_actions > * {
  display: inline;
  margin-right: 10px;
}
html.sfx_notification_popup .sfx_sub_notification {
  padding-left: 50px;
}

.sfx_anonymous {
  border-radius: 3px;
  padding-left: 2px;
  padding-right: 2px;
}
.sfx_anonymous_1 {
  background-color: #E6A4B5;
  color: black !important;
}
.sfx_anonymous_2 {
  background-color: #EDC99A;
  color: black !important;
}
.sfx_anonymous_3 {
  background-color: #F3F190;
  color: black !important;
}
.sfx_anonymous_4 {
  background-color: #BBDB98;
  color: black !important;
}
.sfx_anonymous_5 {
  background-color: #EBCD3E;
  color: black !important;
}
.sfx_anonymous_6 {
  background-color: #6F308B;
  color: white !important;
}
.sfx_anonymous_7 {
  background-color: #DB6A29;
  color: white !important;
}
.sfx_anonymous_8 {
  background-color: #97CEE6;
  color: black !important;
}
.sfx_anonymous_9 {
  background-color: #B92036;
  color: white !important;
}
.sfx_anonymous_10 {
  background-color: #C2BC82;
  color: black !important;
}
.sfx_anonymous_11 {
  background-color: #7F8081;
  color: white !important;
}
.sfx_anonymous_12 {
  background-color: #62A647;
  color: white !important;
}
.sfx_anonymous_13 {
  background-color: #D386B2;
  color: black !important;
}
.sfx_anonymous_14 {
  background-color: #4578B3;
  color: white !important;
}
.sfx_anonymous_15 {
  background-color: #DC8465;
  color: black !important;
}
.sfx_anonymous_16 {
  background-color: #483896;
  color: white !important;
}
.sfx_anonymous_17 {
  background-color: #E1A131;
  color: black !important;
}
.sfx_anonymous_18 {
  background-color: #91288D;
  color: white !important;
}
.sfx_anonymous_19 {
  background-color: #E9E857;
  color: black !important;
}
.sfx_anonymous_20 {
  background-color: #7D1716;
  color: white !important;
}
.sfx_anonymous_21 {
  background-color: #93AD3C;
  color: black !important;
}
.sfx_anonymous_22 {
  background-color: #6E3515;
  color: white !important;
}
.sfx_anonymous_23 {
  background-color: #D12D27;
  color: white !important;
}
.sfx_anonymous_24 {
  background-color: #2C3617;
  color: white !important;
}
.sfx_anonymous_25 {
  background-color: #000000;
  color: white !important;
}

.sfx_bubble_note {
  position: fixed;
  min-height: 50px;
  min-width: 150px;
  max-height: 90vh;
  max-width: 50vw;
  margin: 10px;
  font-family: arial;
  background-color: #FFFFE5;
  color: black;
  border: 1px solid #3F5C71;
  font-size: 12px;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 0 5px #888888;
  z-index: 99999 !important;
  cursor: move;
  overflow: auto;
}
.sfx_bubble_note .sfx_bubble_note_title {
  font-size: 14px;
  font-weight: bold;
  margin: 10px 0;
}
.sfx_bubble_note .sfx_bubble_note_subtitle {
  font-size: 12px;
  font-weight: bold;
  margin: 5px 0;
}
.sfx_bubble_note .sfx_bubble_note_data {
  white-space: pre;
  font-family: monospace;
  font-size: 11px;
  background-color: #ddd;
  overflow: auto;
  max-height: 50vh;
}
.sfx_bubble_note_top_right {
  right: 0;
  top: 0;
}
.sfx_bubble_note_bottom_right {
  right: 0;
  bottom: 0;
}
.sfx_bubble_note_top_left {
  left: 0;
  top: 0;
}
.sfx_bubble_note_bottom_left {
  left: 0;
  bottom: 0;
}

/*
.OPEN_SANS{
  font-family: "OpenSans", monospace !important;
}
@font-face {
  font-family: 'OpenSans';
  src: data-uri( 'data:application/x-font-woff; charset=utf-8;base64','../../assets/fonts/OpenSans/OpenSans-Regular-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'OpenSans';
  src: data-uri( 'data:application/x-font-woff; charset=utf-8;base64','../../assets/fonts/OpenSans/OpenSans-ExtraBold-webfont.woff') format('woff');
  font-weight: bold;
  font-style: normal;
}*/

/*
.OPEN_SANS{
  font-family: "OpenSans", monospace !important;
}
@font-face {
  font-family: 'OpenSans';
  src: data-uri( 'data:application/x-font-woff; charset=utf-8;base64','../../assets/fonts/OpenSans/OpenSans-Regular-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'OpenSans';
  src: data-uri( 'data:application/x-font-woff; charset=utf-8;base64','../../assets/fonts/OpenSans/OpenSans-ExtraBold-webfont.woff') format('woff');
  font-weight: bold;
  font-style: normal;
}*/
#sfx_control_panel {
  position: fixed;
  min-width: 150px;
  max-width: 250px;
  border-radius: 3px;
  background-color: white;
  color: #404040;
  z-index: 99;
  opacity: .6;
  font-size: 12px;
  box-shadow: 0 0 5px rgba(105, 118, 136, 0.2), 0 5px 5px rgba(132, 143, 160, 0.2), 0 10px 10px rgba(132, 143, 160, 0.2), 0 20px 20px rgba(132, 143, 160, 0.2), 0 0 5px rgba(105, 118, 136, 0.3);
}
#sfx_control_panel:hover {
  opacity: 1;
}
#sfx_control_panel .sfx_cp_header {
  font-weight: bold;
  cursor: move;
  margin-bottom: 2px;
  font-size: 9px;
  letter-spacing: 3px;
  text-transform: uppercase;
  vertical-align: top;
  padding: 5px;
  border-radius: 3px 3px 0 0;
  text-align: left;
  border: 0;
  color: #fff;
  background: linear-gradient(to right, #2c4372, #3b5998);
}
#sfx_control_panel .sfx_cp_section_label {
  background-color: #eee;
  font-size: 10px;
  font-family: arial,sans serif;
  font-weight: bold;
  padding: 3px;
}
#sfx_control_panel .sfx_cp_section_content {
  margin-bottom: 5px;
}

/*ELEMENTS*/
/*
.OPEN_SANS{
  font-family: "OpenSans", monospace !important;
}
@font-face {
  font-family: 'OpenSans';
  src: data-uri( 'data:application/x-font-woff; charset=utf-8;base64','../../assets/fonts/OpenSans/OpenSans-Regular-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'OpenSans';
  src: data-uri( 'data:application/x-font-woff; charset=utf-8;base64','../../assets/fonts/OpenSans/OpenSans-ExtraBold-webfont.woff') format('woff');
  font-weight: bold;
  font-style: normal;
}*/
/* REUSABLE STYLES */
.sfx_info {
  font-size: 12px;
}
input {
  border: 1px solid #bec4cd;
  border-radius: 2px;
}
/* BUTTONS */
.sfx_button {
  background-color: #4267b2;
  border: 1px solid #4267b2;
  color: white;
  font-size: 12px;
  line-height: 22px;
  cursor: pointer;
  border-radius: 3px;
  padding: 2px 8px;
  font-weight: bold;
}
.sfx_button:hover {
  background-color: #365899;
}
.sfx_button.secondary {
  background-color: #e7e9ef;
  color: #000000;
  border-color: #d7dce5;
}
.sfx_button.secondary:hover {
  background-color: #d0d5e0;
}
/* DIALOG BOXES */
/*.sfx_dialog {
  background-color:white;
  border:2px solid @fb_blue_dark;
  border-radius:5px;
  z-index:99999;
  overflow:hidden;
  box-shadow:
          0 2px 26px rgba(0, 0, 0, 0.3),
          0 0 0 1px rgba(0, 0, 0, 0.1);
}*/
.sfx_dialog_title_bar {
  padding: 10px 12px;
  font-weight: bold;
  line-height: 28px;
  margin: -10px -10px 0;
  border: 0;
  margin-bottom: 10px;
  color: #fff;
  font-size: 10px;
  letter-spacing: 4px;
  text-transform: uppercase;
  vertical-align: top;
  background: linear-gradient(to right, #2c4372, #3b5998 80%);
}
.sfx_dialog_title_bar .sfx_button {
  letter-spacing: normal !important;
  background-color: #253860;
  border: 0;
}
.sfx_dialog_title_bar .sfx_button.secondary {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: 0;
  font-weight: normal;
}
#sfx_options_dialog {
  z-index: 99999;
  overflow: hidden;
  position: fixed;
  top: 48px;
  left: 20px;
  width: 90vw;
  min-width: 500px;
  max-width: 1000px;
  max-height: 90vh;
  font-family: helvetica, arial, sans-serif;
  transition: height .5s linear;
  color: #404040;
  border: 0;
  border-radius: 3px;
  padding: 10px;
  background-color: #e9ebee;
  box-shadow: 0 0 5px rgba(105, 118, 136, 0.2), 0 5px 5px rgba(132, 143, 160, 0.2), 0 10px 10px rgba(132, 143, 160, 0.2), 0 20px 20px rgba(132, 143, 160, 0.2);
}
/*#sfx_options_dialog_header {
lex:none;
  height:25px;
  font-size:24px;
  line-height:26px;
  overflow:hidden;
}*/
#sfx_options_dialog_sections {
  -webkit-flex: none;
          flex: none;
  width: 125px;
}
#sfx_options_dialog_content {
  padding: 10px;
}
#sfx_options_dialog_body {
  background-color: white;
}
.sfx_options_dialog_section {
  padding: 6px 5px 6px 10px;
  background-color: #f6f7f9;
  font-weight: bold;
  margin: 2px;
  cursor: pointer;
}
.sfx_options_dialog_section.selected {
  background-color: #4267b2;
  color: white;
  cursor: auto;
}
/*END ELEMENTS*/

html.sfx_fix_timestamps abbr.livetimestamp:not(.sfx_no_fix_timestamp):before {
  content: attr(title) " (";
}
html.sfx_fix_timestamps abbr.livetimestamp:not(.sfx_no_fix_timestamp):after {
  content: ")";
}

html:not(.sfx_hide_show_all) .sfx_hide_hidden {
  display: none !important;
}
.sfx_hide_frame {
  position: absolute;
  z-index: 99999;
  opacity: .2;
  background-color: lime;
  outline: 2px solid lime;
  margin: 0 !important;
  font-weight: bold;
  text-align: center;
  color: transparent;
}
.sfx_hide_frame_hidden {
  color: white;
  background-color: red;
  outline: 2px solid red;
}
.sfx_hide_frame_hidden:hover {
  background-color: lime;
  outline: 2px solid red;
}
.sfx_hide_frame:hover {
  outline: 2px solid red;
  background-color: red;
  color: black;
  opacity: .5;
  cursor: pointer;
}
.sfx_hide_bubble {
  width: 400px;
}
.sfx_hide_bubble > div {
  margin: 10px 0;
}
.sfx_hide_bubble .sfx_button {
  margin-left: auto;
  margin-right: auto;
}

/*
.OPEN_SANS{
  font-family: "OpenSans", monospace !important;
}
@font-face {
  font-family: 'OpenSans';
  src: data-uri( 'data:application/x-font-woff; charset=utf-8;base64','../../assets/fonts/OpenSans/OpenSans-Regular-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'OpenSans';
  src: data-uri( 'data:application/x-font-woff; charset=utf-8;base64','../../assets/fonts/OpenSans/OpenSans-ExtraBold-webfont.woff') format('woff');
  font-weight: bold;
  font-style: normal;
}*/
/* Note: Some styles are stored in JS to allow for customization */
/* Posts marked "read" should still show up when following notifications or showing a single post */
#facebook #pagelet_soft_permalink_posts .sfx_post_read > *,
#facebook[sfx_context_permalink="true"] .sfx_post_read > * {
  display: block !important;
}
#facebook #pagelet_soft_permalink_posts .sfx_post_read > *.sfx_post_marked_read_note,
#facebook[sfx_context_permalink="true"] .sfx_post_read > *.sfx_post_marked_read_note {
  display: none !important;
}
html:not(.sfx_show_read_posts) .sfx_post_read:not(.sfx_post_read_show) {
  /* Make sure to remove styles on the post itself that may have been put there by filters and change how the post is displayed */
  outline: none !important;
  border: none !important;
  margin: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
}
html:not(.sfx_show_read_posts) .sfx_post_read:not(.sfx_post_read_show) > *:not(.sfx_post_marked_read_note) {
  display: none !important;
}
html .sfx_post_read.sfx_post_read_show > * {
  display: block !important;
}
.sfx_post_marked_read_note {
  opacity: .3;
  margin: 1px;
  font-size: 10px;
  cursor: pointer;
  padding: 0 5px;
}
.sfx_post_marked_read_note:hover {
  opacity: 1;
}
.sfx_cp_mark_all_read input {
  border-radius: 10px;
  font-size: 11px;
  padding: 2px 3px;
  line-height: 12px;
  font-weight: normal;
}
.sfx_cp_mark_all_read input[disabled="true"] {
  background-color: #eee;
  color: #aaa;
}
#sfx_post_action_tray {
  position: absolute;
  right: 32px;
  top: 1px;
  height: 16px;
  overflow: visible;
}
#sfx_post_action_tray > * {
  display: inline-block;
  width: 16px;
  height: 16px;
  float: right;
  cursor: pointer;
  margin-left: 7px;
  opacity: .5;
  font-size: 16px;
  line-height: 16px;
  background-color: transparent;
  background-repeat: no-repeat;
  color: #b1b5bb;
  z-index: 350;
}
#sfx_post_action_tray > *:hover {
  opacity: 1;
}
.sfx_post_action_menu {
  position: absolute;
  display: none;
  min-width: 150px;
  margin: 2px;
  padding: 4px;
  cursor: pointer;
  background-color: white;
  border: 1px solid #666;
  z-index: 9999;
}
.sfx_post_action_menu > div {
  padding: 4px 2px 4px 10px;
  font-size: 12px;
  font-family: arial, sans-serif;
}
.sfx_post_action_menu > div:hover {
  background-color: #7187b5;
  color: white;
}

/*
.OPEN_SANS{
  font-family: "OpenSans", monospace !important;
}
@font-face {
  font-family: 'OpenSans';
  src: data-uri( 'data:application/x-font-woff; charset=utf-8;base64','../../assets/fonts/OpenSans/OpenSans-Regular-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'OpenSans';
  src: data-uri( 'data:application/x-font-woff; charset=utf-8;base64','../../assets/fonts/OpenSans/OpenSans-ExtraBold-webfont.woff') format('woff');
  font-weight: bold;
  font-style: normal;
}*/
#sfx_badge {
  position: fixed;
  z-index: 350;
  cursor: pointer;
}
#sfx_badge .sfx_sticky_note {
  white-space: nowrap;
}
#sfx_badge_logo {
  position: relative;
  z-index: 351;
  color: white;
  font-size: 9px;
  text-align: center;
  height: 30px;
  width: 30px;
  border-radius: 16px;
  opacity: .5;
  border: 2px solid transparent;
  box-shadow: 3px 3px 3px #1c1c1c;
  background: #2c4166 url(data:image/gif;base64,R0lGODlhFwAXAOYAAJOgv3%2BOr4KRsYWUtIiXt5GfvpmnxZimxJelw5mmxKCuzKCty6GuzKOwzaKvzKe00aWyz09hhFVnilZoi1lrjlxtkGh5mml6m2x9nmt8nW%2BAoW19nnGCo29%2FoHSEpXKCo3yMrH%2BPr4SUs4CProeWtYWUs4mYt4iXtoybuoqZuI6dvI2cupWkwpalwpakwZ2ryKCuy56syaGvzCxBZi1CZy5DaDFGazJHbDFFajNHbDVJbjZKbzhMcThMcDpOczpOcj1RdUBUeEBTd0JWekFVeERYe0VYfElcf1FkhlRniVhqjFxukGFzlGV3mHqLqjBFaTNIbDZLbzlOcv%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFMALAAAAAAXABcAAAe4gFMzg4SFhoeCh4Y9ShkeHUtSipNNLw%2BXlwxHk4YSmJcQAxQ7nIUlmAcbQ6WGOwuYH6yHEZ8JNrKFHJ8PE4Y1nDUFuyKDOUgCTJxFuw8NERgIlxecGsy7DUSTQArWnxWTNSTdmB7gTuOXATSKTyPMDiBJLA8mN4o4IbswG0CDFgY8FEER9wmFkEJR%2Bh3aQWDXCSi4fqzYlUIHrhkqdgGIcnGGjE8ufHScwQBVkJEzpsSI0cIIyimBAAA7) no-repeat center center;
}
#sfx_badge:hover #sfx_badge_logo {
  opacity: 1;
  border: 2px solid white;
  box-shadow: none;
}
#sfx_badge_menu {
  z-index: 350;
  display: none;
  position: absolute;
  background-color: transparent;
  color: black;
  width: 250px;
}
#sfx_badge_menu.left {
  right: 12px;
}
#sfx_badge_menu.right {
  left: 25px;
}
#sfx_badge_menu.down {
  top: 0;
}
#sfx_badge_menu.up {
  bottom: 15px;
}
#sfx_badge_menu.up #sfx_badge_menu_wrap {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column-reverse;
          flex-direction: column-reverse;
}
#sfx_badge_menu_wrap {
  background-color: white;
  border-radius: 4px;
  border-color: #ddd;
  padding: 10px;
  margin-top: 20px;
  box-shadow: 0 0 5px rgba(105, 118, 136, 0.2), 0 5px 5px rgba(132, 143, 160, 0.2), 0 10px 10px rgba(132, 143, 160, 0.2), 0 20px 20px rgba(132, 143, 160, 0.2), 0 0 5px rgba(105, 118, 136, 0.3);
}
.sfx_menu_section {
  margin-bottom: 10px;
}
.sfx_menu_section:last-child {
  margin-bottom: 0;
}
.sfx_menu_section .sfx_menu_section_title {
  color: #3b5998;
  font-size: 9px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #bec4cd;
  padding: 0 5px;
}
.sfx_menu_section .sfx_menu_item {
  padding: 3px 5px 3px 15px;
  font-size: 12px;
}
.sfx_menu_section .sfx_menu_item .sfx_news_title {
  font-size: 12px;
  color: #666;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1px 5px;
}
.sfx_menu_section .sfx_menu_item:hover {
  background-color: #7187b5;
  color: white;
}
.sfx_menu_section .sfx_menu_item:hover .sfx_news_title {
  color: white;
}
.sfx_menu_section .sfx_menu_item a.sfx_menu_item_content {
  text-decoration: none;
  color: inherit;
}

.sfx_notification_count {
  background-color: #F40008;
  color: white;
  position: absolute;
  top: -3px;
  left: -3px;
  font-size: 12px;
  font-weight: bold;
  padding: 0 1px;
  border: 1px solid #F40008;
  border-radius: 3px;
  z-index: 352;
  box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.9);
}

.sfx_filter_subscribed {
  opacity: .5;
  background-color: #d4ffd3;
}
.sfx_filter_subscribed .sfx_square_add {
  display: none;
}

.sfx_tweak_subscribed {
  opacity: .5;
  background-color: #afffbe;
}
.sfx_tweak_subscribed .sfx_square_add {
  display: none;
}

/*
.OPEN_SANS{
  font-family: "OpenSans", monospace !important;
}
@font-face {
  font-family: 'OpenSans';
  src: data-uri( 'data:application/x-font-woff; charset=utf-8;base64','../../assets/fonts/OpenSans/OpenSans-Regular-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'OpenSans';
  src: data-uri( 'data:application/x-font-woff; charset=utf-8;base64','../../assets/fonts/OpenSans/OpenSans-ExtraBold-webfont.woff') format('woff');
  font-weight: bold;
  font-style: normal;
}*/
div.sfx_option {
  line-height: 24px;
  vertical-align: middle;
}
div.sfx_option input[type=checkbox]:not(.normal) ~ label {
  float: left;
  margin-right: 5px;
}
.sfx_square_control {
  height: 20px;
  width: 20px;
  cursor: pointer;
  border-radius: 3px;
  padding: 0;
  display: inline-block;
  overflow: hidden;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  background-color: #fff;
  color: #4267b2;
  /*
  &:hover {
    opacity:.9;
  }*/
}
.sfx_square_add {
  height: 20px;
  width: 20px;
  cursor: pointer;
  border-radius: 3px;
  padding: 0;
  display: inline-block;
  overflow: hidden;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  background-color: #fff;
  color: #4267b2;
  /*
  &:hover {
    opacity:.9;
  }*/
  color: white;
  background-color: #42b72a;
  box-shadow: none;
}
.sfx_square_delete {
  color: #a60000;
  background-color: white;
}
#sfx_options_dialog input[type=checkbox]:not(.normal) {
  display: none;
}
#sfx_options_dialog input[type=checkbox]:not(.normal) ~ label {
  height: 20px;
  width: 20px;
  cursor: pointer;
  border-radius: 3px;
  padding: 0;
  display: inline-block;
  overflow: hidden;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  background-color: #fff;
  color: #4267b2;
  /*
  &:hover {
    opacity:.9;
  }*/
  box-shadow: inset 0 0 0 2px #3b5998;
  color: white;
}
#sfx_options_dialog input[type=checkbox]:not(.normal) ~ label:hover {
  opacity: 1;
}
#sfx_options_dialog input[type=checkbox]:not(.normal):checked ~ label {
  background-color: #3b5998;
  color: #fff;
}
#sfx_options_dialog input[type=checkbox]:not(.normal):checked ~ label:after {
  content: '\\2714';
  height: 20px;
  width: 20px;
  display: inline-block;
  font-size: 20px;
  line-height: 20px;
}
/* Section Headers displayed in right panel */
.sfx_options_dialog_section_header {
  margin: 6px 0 16px 0;
  font-size: 16px;
}
/* Options List Table */
.sfx_options_dialog_table {
  border-collapse: collapse;
  cell-spacing: 0;
  border-bottom: 1px solid #ccc;
  width: 95%;
  margin-top: 10px;
  margin-bottom: 5px;
}
.sfx_options_dialog_table thead {
  border-bottom: 2px solid #4267b2;
}
.sfx_options_dialog_table thead tr th {
  text-align: left;
  font-weight: bold;
  padding: 3px 5px;
  color: #4267b2;
}
.sfx_options_dialog_table tbody tr:hover td {
  background-color: #e9ebee;
}
.sfx_options_dialog_table tbody td {
  border-top: 1px solid #ccc;
  padding: 3px;
  vertical-align: top;
}
.sfx_options_dialog_table tbody td.repeat {
  border-top: none;
  visibility: hidden;
}
.sfx_options_dialog_table .sfx_options_dialog_option_title {
  font-size: 11px;
  font-weight: bold;
  width: 160px;
  padding-right: 20px;
}
.sfx_options_dialog_table .sfx_options_dialog_option_description {
  font-size: 12px;
  color: #5a5a5a;
}
.sfx_options_dialog_table .sfx_options_dialog_option_action {
  padding-right: 10px;
  padding-left: 10px;
}
.sfx_options_dialog_table .sfx_options_dialog_option_action input[type=checkbox] {
  -webkit-transform: scale(1.25);
          transform: scale(1.25);
}
.sfx_options_dialog_table .sfx_options_dialog_option_disabled {
  opacity: .7;
}
#sfx_options_dialog_actions {
  float: right;
}
/* Dialog Panels */
.sfx_panel {
  padding: 5px;
}
.sfx_panel_title_bar {
  padding: 0 3px;
  color: #4267b2;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 5px;
}
.sfx_options_dialog_panel {
  padding: 5px;
}
.sfx_options_dialog_panel > div:last-child {
  margin-top: 10px;
}
.sfx_options_dialog_panel .sfx_options_dialog_panel {
  background-color: #e7e9ef;
  margin: 10px 0;
}
.sfx_options_dialog_panel .sfx_options_dialog_panel .sfx_panel_title_bar {
  font-size: 18px;
}
.sfx_options_dialog_panel .sfx_options_dialog_panel_button {
  float: right;
  margin: 5px;
}
/* Filter Styles */
.sfx_options_dialog_filter_list .sfx_options_dialog_filter {
  padding: 5px;
}
.sfx_options_dialog_filter_conditions,
.sfx_options_dialog_filter_actions {
  margin-top: 0;
}
.sfx_options_dialog_panel_header {
  font-weight: bold;
  margin: 30px 0 10px;
  color: #697688;
  font-size: 15px;
  background-color: #e9ebee;
  padding: 10px;
}

.sfx_filter_hidden:not(.sfx_filter_hidden_show) > *:not(.sfx_filter_hidden_note) {
  display: none !important;
}
.sfx_filter_hidden.sfx_filter_hidden_show > *:not(.sfx_filter_hidden_note) {
  opacity: .5;
}
.sfx_filter_hidden.sfx_filter_hidden_show:hover > *:not(.sfx_filter_hidden_note) {
  opacity: 1;
}
.sfx_filter_hidden_note {
  padding: 0 5px;
  border: 1px dashed #333;
  font-size: 11px;
  opacity: .5;
  cursor: pointer;
  margin-top: 2px;
}
.sfx_filter_hidden_note:hover {
  opacity: 1;
}
/* "More Stories" Pager */
.sfx-pager-disabled {
  position: fixed !important;
  top: 20000px !important;
}

/*
.OPEN_SANS{
  font-family: "OpenSans", monospace !important;
}
@font-face {
  font-family: 'OpenSans';
  src: data-uri( 'data:application/x-font-woff; charset=utf-8;base64','../../assets/fonts/OpenSans/OpenSans-Regular-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'OpenSans';
  src: data-uri( 'data:application/x-font-woff; charset=utf-8;base64','../../assets/fonts/OpenSans/OpenSans-ExtraBold-webfont.woff') format('woff');
  font-weight: bold;
  font-style: normal;
}*/
#sfx_control_panel .sfx_filter_tab {
  cursor: pointer;
  padding: 2px 10px 2px 5px;
  background-color: #f6f7f9;
}
#sfx_control_panel .sfx_filter_tab:hover {
  background-color: #5890ff;
}
#sfx_control_panel .sfx_filter_tab:hover .sfx_count {
  color: black;
}
#sfx_control_panel .sfx_filter_tab.selected {
  background-color: #4267b2;
  color: white;
}
#sfx_control_panel .sfx_filter_tab.selected .sfx_count {
  color: white;
}
#sfx_control_panel .sfx_count {
  font-style: italic;
  color: #999;
}
.sfx_filter_tab_hidden {
  display: none !important;
}

html.sfx_stealth_mode .UFILikeLink,
html.sfx_stealth_mode .FriendRequestAdd,
html.sfx_stealth_mode .addFriendText,
html.sfx_stealth_mode .UFIAddComment,
html.sfx_stealth_mode .UFIReplyLink,
html.sfx_stealth_mode .PageLikeButton,
html.sfx_stealth_mode .share_action_link,
html.sfx_stealth_mode .comment_link,
html.sfx_stealth_mode a[data-tooltip-content^="Like"] {
  display: none !important;
}

/* "Sticky" note */
.sfx_sticky_note {
  position: absolute;
  min-height: 14px;
  min-width: 150px;
  right: 100%;
  margin-right: 8px;
  top: 50%;
  font-family: arial;
  background-color: #FFFFE5;
  color: black;
  border: 1px solid #3F5C71;
  font-size: 12px;
  padding: 3px;
  text-align: center;
  border-radius: 6px;
  box-shadow: 0 0 5px #888888;
  z-index: 9999 !important;
}
.sfx_sticky_note_right {
  left: 100%;
  right: auto;
  margin-left: 8px;
  margin-right: auto;
}
.sfx_sticky_note_left {
  right: 100%;
  left: auto;
  margin-right: 8px;
  margin-left: auto;
}
.sfx_sticky_note_bottom {
  top: 200%;
  right: auto;
  left: -25%;
  margin-top: 8px;
  margin-right: 0;
  margin-left: -3px;
}
.sfx_sticky_note_top {
  top: -100%;
  right: auto;
  left: -25%;
  margin-bottom: 8px;
  margin-right: 0;
  margin-left: -3px;
}
.sfx_sticky_note_arrow_border {
  border-color: transparent transparent transparent #666666;
  border-style: solid;
  border-width: 7px;
  height: 0;
  width: 0;
  position: absolute;
  margin-top: -7px;
  top: 50%;
  right: -15px;
}
.sfx_sticky_note_right .sfx_sticky_note_arrow_border {
  border-color: transparent #666666 transparent transparent;
  top: 50%;
  right: auto;
  left: -15px;
}
.sfx_sticky_note_left .sfx_sticky_note_arrow_border {
  border-color: transparent transparent transparent #666666;
  top: 50%;
  right: -15px;
  left: auto;
}
.sfx_sticky_note_bottom .sfx_sticky_note_arrow_border {
  border-color: transparent transparent #666666 transparent;
  left: 50%;
  right: auto;
  top: -15px;
  margin-left: -7px;
  margin-top: 0;
}
.sfx_sticky_note_top .sfx_sticky_note_arrow_border {
  border-color: #666666 transparent transparent transparent;
  left: 50%;
  right: auto;
  top: auto;
  bottom: -15px;
  margin-left: -7px;
  margin-bottom: 0;
}
.sfx_sticky_note_arrow {
  border-color: transparent transparent transparent #ffa;
  border-style: solid;
  border-width: 7px;
  height: 0;
  width: 0;
  position: absolute;
  top: 50%;
  right: -13px;
  margin-top: -7px;
}
.sfx_sticky_note_right .sfx_sticky_note_arrow {
  border-color: transparent #ffa transparent transparent;
  top: 50%;
  right: auto;
  left: -13px;
}
.sfx_sticky_note_left .sfx_sticky_note_arrow {
  border-color: transparent transparent transparent #ffa;
  top: 50%;
  right: -13px;
  left: auto;
}
.sfx_sticky_note_bottom .sfx_sticky_note_arrow {
  border-color: transparent transparent #ffa transparent;
  left: 50%;
  right: auto;
  top: -13px;
  margin-left: -7px;
  margin-top: 0;
}
.sfx_sticky_note_top .sfx_sticky_note_arrow {
  border-color: #ffa transparent transparent transparent;
  left: 50%;
  right: auto;
  bottom: -13px;
  top: auto;
  margin-left: -7px;
  margin-bottom: 0;
}
.sfx_sticky_note_close {
  float: left;
  width: 9px;
  height: 9px;
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
  background-image: url("data:image/gif,GIF89a%07%00%07%00%91%00%00%00%00%00%FF%FF%FF%9C%9A%9C%FF%FF%FF!%F9%04%01%00%00%03%00%2C%00%00%00%00%07%00%07%00%00%02%0C%94%86%A6%B3j%C8%5Er%F1%B83%0B%00%3B");
  border: 1px solid transparent;
  float: right;
}
div.sfx_sticky_note_close:hover {
  background-image: url("data:image/gif,GIF89a%07%00%07%00%91%00%00%00%00%00%FF%FF%FF%FF%FF%FF%00%00%00!%F9%04%01%00%00%02%00%2C%00%00%00%00%07%00%07%00%00%02%0C%04%84%A6%B2j%C8%5Er%F1%B83%0B%00%3B");
  border: 1px solid black;
}

/*
.OPEN_SANS{
  font-family: "OpenSans", monospace !important;
}
@font-face {
  font-family: 'OpenSans';
  src: data-uri( 'data:application/x-font-woff; charset=utf-8;base64','../../assets/fonts/OpenSans/OpenSans-Regular-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'OpenSans';
  src: data-uri( 'data:application/x-font-woff; charset=utf-8;base64','../../assets/fonts/OpenSans/OpenSans-ExtraBold-webfont.woff') format('woff');
  font-weight: bold;
  font-style: normal;
}*/
.sfx_hidden {
  display: none !important;
}
.sfx_clickable {
  cursor: pointer !important;
}
.sfx_link {
  text-decoration: underline !important;
  cursor: pointer !important;
}
.sfx_info_icon {
  content: "i";
  position: absolute;
  display: block;
  left: 6px;
  top: 6px;
  width: 20px;
  height: 20px;
  font-size: 18px;
  line-height: 18px;
  text-align: center;
  font-style: italic;
  vertical-align: center;
  font-family: serif !important;
  font-weight: bold;
  background-color: #5890ff;
  color: white;
  padding: 0;
  border-radius: 20px;
}
.sfx_info {
  background-color: #FFFFE5;
  border: 1px solid #666;
  border-radius: 6px;
  padding: 7px;
  margin: 5px;
  font-family: arial;
  font-size: 12px;
  padding-left: 35px;
  position: relative;
}
.sfx_info::before {
  content: "i";
  position: absolute;
  display: block;
  left: 6px;
  top: 6px;
  width: 20px;
  height: 20px;
  font-size: 18px;
  line-height: 18px;
  text-align: center;
  font-style: italic;
  vertical-align: center;
  font-family: serif !important;
  font-weight: bold;
  background-color: #5890ff;
  color: white;
  padding: 0;
  border-radius: 20px;
}
.sfx_label_value {
  display: table;
  width: 95%;
  margin: 3px;
}
.sfx_label_value > * {
  display: table-cell;
}
.sfx_label_value input.sfx_wide {
  width: 100%;
}
.sfx_label_value > *:first-child {
  font-weight: bold;
  padding-right: 10px;
  width: 1px;
}
.sfx_label_value > .stretch {
  width: 100%;
}
*[data-title]:after {
  content: attr(data-title);
  font-size: 0;
  opacity: 0;
}
*[data-title]:hover:after {
  content: attr(data-title);
  position: absolute;
  margin-left: 7px;
  margin-top: 3px;
  font-size: 12px;
  background-color: #666;
  color: white;
  padding: 5px;
  border: 1px solid black;
  border-radius: 5px;
  z-index: 9999;
  opacity: .9;
  transition: font-size 0s 0s ease, opacity 0.3s 0.5s;
}
/* A "Help" icon with tooltip */
.sfx-help-icon:after {
  display: inline-block;
  height: 14px;
  width: 14px;
  vertical-align: middle;
  background-color: #7187b5;
  color: white;
  border-radius: 50%;
  content: "?";
  cursor: help;
  text-align: center;
  line-height: 12px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: normal;
}
/* FLEXBOX */
.flex-row,
.flex-column {
  display: -webkit-flex;
  display: flex;
}
.flex-row > *,
.flex-column > * {
  -webkit-flex: auto;
          flex: auto;
  -webkit-align-self: auto;
          align-self: auto;
  overflow: auto;
}
.flex-row,
.flex-column {
  -webkit-flex-wrap: nowrap;
          flex-wrap: nowrap;
  -webkit-justify-content: flex-start;
          justify-content: flex-start;
  -webkit-align-content: stretch;
          align-content: stretch;
  -webkit-align-items: stretch;
          align-items: stretch;
}
.flex-row {
  -webkit-flex-direction: row;
          flex-direction: row;
}
.flex-column {
  -webkit-flex-direction: column;
          flex-direction: column;
}

/* Support Group Styles */
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper {
  margin-top: 7px !important;
  padding: 5px !important;
  border: 2px solid #3D5B99 !important;
  border-radius: 10px !important;
  background-color: #D8DFEA !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .userContent,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .userContent {
  color: #333 !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .userContent a,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .userContent a,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .userContent .actorName a,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .userContent .actorName a {
  color: #3b5998 !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .uiStreamStory,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .uiStreamStory {
  text-align: left !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper div.actorName,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper div.actorName,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper h5.uiStreamMessage,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper h5.uiStreamMessage,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .messageBody div,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .messageBody div {
  display: inline;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .mainWrapper,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .mainWrapper {
  padding-top: 5px;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .actorPhoto,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .actorPhoto {
  margin-top: 6px;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .UFIBlingBox,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .UFIBlingBox {
  border-bottom: lightblue !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .UIActionLinks,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .UIActionLinks,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .uiStreamFooter ~ div,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .uiStreamFooter ~ div,
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper form,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper form {
  display: none !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .text_exposed_show,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .text_exposed_show {
  display: block !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper .text_exposed_hide,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper .text_exposed_hide {
  display: none !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper:before,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper:before {
  content: "Please read the notes below before posting!";
  text-align: center;
  font-size: 18px !important;
  font-weight: bold !important;
  color: red !important;
  display: inline-block !important;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea #pagelet_pinned_posts .userContentWrapper:hover,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea #pagelet_pinned_posts .userContentWrapper:hover {
  height: auto;
}
html[sfx_url^="/groups/412712822130938/"] #contentArea .UFIReplyLink,
html[sfx_url^="/groups/SocialFixerUserSupport"] #contentArea .UFIReplyLink {
  display: none;
}
/* Hide Reply links in other places */
html[sfx_url^="/groups/SFxOffTopic"] .UFIReplyLink {
  display: none;
}

.sfx_watch {
  display: inline-block;
  width: 12px;
  height: 12px;
  opacity: .3;
  background: transparent url("data:image/gif;base64,R0lGODlhDAAMAMQAAG9vb%2Fr6%2BllZWfn5%2BUdHR1JSUvv7%2BzExMTY2NjMzM39%2Ff%2B%2Fv78DAwP7%2B%2FqOjoxkZGVRUVAAAAP%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAMAAwAAAVNoCQ2DvQ8kNOIUqNEcKyskhMJixQwSeSIkMgiFmFEIKIHjCWBPZKRQDMiijwlheJUMkQOEJEDw8AV%2BAZBoqyRjhBMKNU0AmAyYXU7KwQAOw%3D%3D") no-repeat;
}
.sfx_watch:hover {
  opacity: 1;
}


.mark_read_filter {
    background-image: url('data:image/gif;base64,R0lGODlhEAAQAIABALG1u////yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpENjNFRjc1MDgxOUQxMUU2QkNGRUVGQTY0MjZCNTFGMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpENjNFRjc1MTgxOUQxMUU2QkNGRUVGQTY0MjZCNTFGMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQ2M0VGNzRFODE5RDExRTZCQ0ZFRUZBNjQyNkI1MUYxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQ2M0VGNzRGODE5RDExRTZCQ0ZFRUZBNjQyNkI1MUYxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAABAAEAAAAiCMjxnA7Q+jW/Kd2hJWFHLjfWAmjkxpAminopNLlu/6FQA7');
}

.mark_read_wrench {
    background-image: url('data:image/gif;base64,R0lGODlhEAAQANUyALq9wra5v/39/bO3vd7f4rS4vvn5+vf3+O7v8P7+/rW4vvz8/bW5v7W5vujp69/h5Nze4fz8/O/w8ezt7/Lz9M3Q1Ly/xbO2vOHj5cDDyPX19srN0e7u8L7BxszP0rS4vbq+w/Hx8re7wLK2vObn6dvd4NPV2MLFycXIzMnM0Pb298vN0bu/xPj4+fn5+dja3cbJzrG1u////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNTEzNTkwRDgwMDExMUU2QjEwM0Y3OUQ5MTZEMkVGNiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowNTEzNTkwRTgwMDExMUU2QjEwM0Y3OUQ5MTZEMkVGNiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA1MTM1OTBCODAwMTExRTZCMTAzRjc5RDkxNkQyRUY2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA1MTM1OTBDODAwMTExRTZCMTAzRjc5RDkxNkQyRUY2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAMgAsAAAAABAAEAAABnJAmXAoRDyIyKFmEzMlkSRFLGB4DhGDWKxETECQFa1iQSQEkCetSDA8MGJIlja2YstSsQISMI91XjBaAEQLF32HKEQYh4cEQxQBjHMZdip8cwMgWSMeVTItFnMfBBFCLglEB5cNE1ZDIQUBHK5EDhK0QkEAOw==');
}

.social_fixer_watch {
    background-image: url('data:image/gif;base64,R0lGODlhDAAMAMQAAG9vb/r6+llZWfn5+UdHR1JSUvv7+zExMTY2NjMzM39/f+/v78DAwP7+/qOjoxkZGVRUVAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAMAAwAAAVNoCQ2DvQ8kNOIUqNEcKyskhMJixQwSeSIkMgiFmFEIKIHjCWBPZKRQDMiijwlheJUMkQOEJEDw8AV+AZBoqyRjhBMKNU0AmAyYXU7KwQAOw==');
}
`);
try {
// Libraries
// ===========
var XLib = function( args ) {
	args = args || {};

	// LOCAL CHANGE to prevent errors in Chrome:
	// -  !t.isImmediatePropagationStopped()
	// +  (!t.isImmediatePropagationStopped || !t.isImmediatePropagationStopped())
	// http://github.e-sites.nl/zeptobuilder/
	/*! Zepto 1.2.0 (generated with Zepto Builder) - zepto event - zeptojs.com/license */
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	var Zepto = (function() {
		var undefined, key, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,
			document = window.document,
			elementDisplay = {}, classCache = {},
			cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
			fragmentRE = /^\s*<(\w+|!)[^>]*>/,
			singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
			tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
			rootNodeRE = /^(?:body|html)$/i,
			capitalRE = /([A-Z])/g,

			// special attributes that should be get/set via method calls
			methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

			adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
			table = document.createElement('table'),
			tableRow = document.createElement('tr'),
			containers = {
				'tr': document.createElement('tbody'),
				'tbody': table, 'thead': table, 'tfoot': table,
				'td': tableRow, 'th': tableRow,
				'*': document.createElement('div')
			},
			readyRE = /complete|loaded|interactive/,
			simpleSelectorRE = /^[\w-]*$/,
			class2type = {},
			toString = class2type.toString,
			zepto = {},
			camelize, uniq,
			tempParent = document.createElement('div'),
			propMap = {
				'tabindex': 'tabIndex',
				'readonly': 'readOnly',
				'for': 'htmlFor',
				'class': 'className',
				'maxlength': 'maxLength',
				'cellspacing': 'cellSpacing',
				'cellpadding': 'cellPadding',
				'rowspan': 'rowSpan',
				'colspan': 'colSpan',
				'usemap': 'useMap',
				'frameborder': 'frameBorder',
				'contenteditable': 'contentEditable'
			},
			isArray = Array.isArray ||
				function(object){ return object instanceof Array }

		zepto.matches = function(element, selector) {
			if (!selector || !element || element.nodeType !== 1) return false
			var matchesSelector = element.matches || element.webkitMatchesSelector ||
				element.mozMatchesSelector || element.oMatchesSelector ||
				element.matchesSelector
			if (matchesSelector) return matchesSelector.call(element, selector)
			// fall back to performing a selector:
			var match, parent = element.parentNode, temp = !parent
			if (temp) (parent = tempParent).appendChild(element)
			match = ~zepto.qsa(parent, selector).indexOf(element)
			temp && tempParent.removeChild(element)
			return match
		}

		function type(obj) {
			return obj == null ? String(obj) :
			class2type[toString.call(obj)] || "object"
		}

		function isFunction(value) { return type(value) == "function" }
		function isWindow(obj)     { return obj != null && obj == obj.window }
		function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
		function isObject(obj)     { return type(obj) == "object" }
		function isPlainObject(obj) {
			return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
		}

		function likeArray(obj) {
			var length = !!obj && 'length' in obj && obj.length,
				type = $.type(obj)

			return 'function' != type && !isWindow(obj) && (
					'array' == type || length === 0 ||
					(typeof length == 'number' && length > 0 && (length - 1) in obj)
				)
		}

		function compact(array) { return filter.call(array, function(item){ return item != null }) }
		function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
		camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
		function dasherize(str) {
			return str.replace(/::/g, '/')
				.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
				.replace(/([a-z\d])([A-Z])/g, '$1_$2')
				.replace(/_/g, '-')
				.toLowerCase()
		}
		uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

		function classRE(name) {
			return name in classCache ?
				classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
		}

		function maybeAddPx(name, value) {
			return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
		}

		function defaultDisplay(nodeName) {
			var element, display
			if (!elementDisplay[nodeName]) {
				element = document.createElement(nodeName)
				document.body.appendChild(element)
				display = getComputedStyle(element, '').getPropertyValue("display")
				element.parentNode.removeChild(element)
				display == "none" && (display = "block")
				elementDisplay[nodeName] = display
			}
			return elementDisplay[nodeName]
		}

		function children(element) {
			return 'children' in element ?
				slice.call(element.children) :
				$.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
		}

		function Z(dom, selector) {
			var i, len = dom ? dom.length : 0
			for (i = 0; i < len; i++) this[i] = dom[i]
			this.length = len
			this.selector = selector || ''
		}

		// `$.zepto.fragment` takes a html string and an optional tag name
		// to generate DOM nodes from the given html string.
		// The generated DOM nodes are returned as an array.
		// This function can be overridden in plugins for example to make
		// it compatible with browsers that don't support the DOM fully.
		zepto.fragment = function(html, name, properties) {
			var dom, nodes, container

			// A special case optimization for a single tag
			if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

			if (!dom) {
				if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
				if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
				if (!(name in containers)) name = '*'

				container = containers[name]
				container.innerHTML = '' + html
				dom = $.each(slice.call(container.childNodes), function(){
					container.removeChild(this)
				})
			}

			if (isPlainObject(properties)) {
				nodes = $(dom)
				$.each(properties, function(key, value) {
					if (methodAttributes.indexOf(key) > -1) nodes[key](value)
					else nodes.attr(key, value)
				})
			}

			return dom
		}

		// `$.zepto.Z` swaps out the prototype of the given `dom` array
		// of nodes with `$.fn` and thus supplying all the Zepto functions
		// to the array. This method can be overridden in plugins.
		zepto.Z = function(dom, selector) {
			return new Z(dom, selector)
		}

		// `$.zepto.isZ` should return `true` if the given object is a Zepto
		// collection. This method can be overridden in plugins.
		zepto.isZ = function(object) {
			return object instanceof zepto.Z
		}

		// `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
		// takes a CSS selector and an optional context (and handles various
		// special cases).
		// This method can be overridden in plugins.
		zepto.init = function(selector, context) {
			var dom
			// If nothing given, return an empty Zepto collection
			if (!selector) return zepto.Z()
			// Optimize for string selectors
			else if (typeof selector == 'string') {
				selector = selector.trim()
				// If it's a html fragment, create nodes from it
				// Note: In both Chrome 21 and Firefox 15, DOM error 12
				// is thrown if the fragment doesn't begin with <
				if (selector[0] == '<' && fragmentRE.test(selector))
					dom = zepto.fragment(selector, RegExp.$1, context), selector = null
				// If there's a context, create a collection on that context first, and select
				// nodes from there
				else if (context !== undefined) return $(context).find(selector)
				// If it's a CSS selector, use it to select nodes.
				else dom = zepto.qsa(document, selector)
			}
			// If a function is given, call it when the DOM is ready
			else if (isFunction(selector)) return $(document).ready(selector)
			// If a Zepto collection is given, just return it
			else if (zepto.isZ(selector)) return selector
			else {
				// normalize array if an array of nodes is given
				if (isArray(selector)) dom = compact(selector)
				// Wrap DOM nodes.
				else if (isObject(selector))
					dom = [selector], selector = null
				// If it's a html fragment, create nodes from it
				else if (fragmentRE.test(selector))
					dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
				// If there's a context, create a collection on that context first, and select
				// nodes from there
				else if (context !== undefined) return $(context).find(selector)
				// And last but no least, if it's a CSS selector, use it to select nodes.
				else dom = zepto.qsa(document, selector)
			}
			// create a new Zepto collection from the nodes found
			return zepto.Z(dom, selector)
		}

		// `$` will be the base `Zepto` object. When calling this
		// function just call `$.zepto.init, which makes the implementation
		// details of selecting nodes and creating Zepto collections
		// patchable in plugins.
		$ = function(selector, context){
			return zepto.init(selector, context)
		}

		function extend(target, source, deep) {
			for (key in source)
				if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
					if (isPlainObject(source[key]) && !isPlainObject(target[key]))
						target[key] = {}
					if (isArray(source[key]) && !isArray(target[key]))
						target[key] = []
					extend(target[key], source[key], deep)
				}
				else if (source[key] !== undefined) target[key] = source[key]
		}

		// Copy all but undefined properties from one or more
		// objects to the `target` object.
		$.extend = function(target){
			var deep, args = slice.call(arguments, 1)
			if (typeof target == 'boolean') {
				deep = target
				target = args.shift()
			}
			args.forEach(function(arg){ extend(target, arg, deep) })
			return target
		}

		// `$.zepto.qsa` is Zepto's CSS selector implementation which
		// uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
		// This method can be overridden in plugins.
		zepto.qsa = function(element, selector){
			var found,
				maybeID = selector[0] == '#',
				maybeClass = !maybeID && selector[0] == '.',
				nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
				isSimple = simpleSelectorRE.test(nameOnly)
			return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
				( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
				(element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
					slice.call(
						isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
							maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
								element.getElementsByTagName(selector) : // Or a tag
							element.querySelectorAll(selector) // Or it's not simple, and we need to query all
					)
		}

		function filtered(nodes, selector) {
			return selector == null ? $(nodes) : $(nodes).filter(selector)
		}

		$.contains = document.documentElement.contains ?
			function(parent, node) {
				return parent !== node && parent.contains(node)
			} :
			function(parent, node) {
				while (node && (node = node.parentNode))
					if (node === parent) return true
				return false
			}

		function funcArg(context, arg, idx, payload) {
			return isFunction(arg) ? arg.call(context, idx, payload) : arg
		}

		function setAttribute(node, name, value) {
			value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
		}

		// access className property while respecting SVGAnimatedString
		function className(node, value){
			var klass = node.className || '',
				svg   = klass && klass.baseVal !== undefined

			if (value === undefined) return svg ? klass.baseVal : klass
			svg ? (klass.baseVal = value) : (node.className = value)
		}

		// "true"  => true
		// "false" => false
		// "null"  => null
		// "42"    => 42
		// "42.5"  => 42.5
		// "08"    => "08"
		// JSON    => parse if valid
		// String  => self
		function deserializeValue(value) {
			try {
				return value ?
				value == "true" ||
				( value == "false" ? false :
					value == "null" ? null :
						+value + "" == value ? +value :
							/^[\[\{]/.test(value) ? $.parseJSON(value) :
								value )
					: value
			} catch(e) {
				return value
			}
		}

		$.type = type
		$.isFunction = isFunction
		$.isWindow = isWindow
		$.isArray = isArray
		$.isPlainObject = isPlainObject

		$.isEmptyObject = function(obj) {
			var name
			for (name in obj) return false
			return true
		}

		$.isNumeric = function(val) {
			var num = Number(val), type = typeof val
			return val != null && type != 'boolean' &&
				(type != 'string' || val.length) &&
				!isNaN(num) && isFinite(num) || false
		}

		$.inArray = function(elem, array, i){
			return emptyArray.indexOf.call(array, elem, i)
		}

		$.camelCase = camelize
		$.trim = function(str) {
			return str == null ? "" : String.prototype.trim.call(str)
		}

		// plugin compatibility
		$.uuid = 0
		$.support = { }
		$.expr = { }
		$.noop = function() {}

		$.map = function(elements, callback){
			var value, values = [], i, key
			if (likeArray(elements))
				for (i = 0; i < elements.length; i++) {
					value = callback(elements[i], i)
					if (value != null) values.push(value)
				}
			else
				for (key in elements) {
					value = callback(elements[key], key)
					if (value != null) values.push(value)
				}
			return flatten(values)
		}

		$.each = function(elements, callback){
			var i, key
			if (likeArray(elements)) {
				for (i = 0; i < elements.length; i++)
					if (callback.call(elements[i], i, elements[i]) === false) return elements
			} else {
				for (key in elements)
					if (callback.call(elements[key], key, elements[key]) === false) return elements
			}

			return elements
		}

		$.grep = function(elements, callback){
			return filter.call(elements, callback)
		}

		if (window.JSON) $.parseJSON = JSON.parse

		// Populate the class2type map
		$.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
			class2type[ "[object " + name + "]" ] = name.toLowerCase()
		})

		// Define methods that will be available on all
		// Zepto collections
		$.fn = {
			constructor: zepto.Z,
			length: 0,

			// Because a collection acts like an array
			// copy over these useful array functions.
			forEach: emptyArray.forEach,
			reduce: emptyArray.reduce,
			push: emptyArray.push,
			sort: emptyArray.sort,
			splice: emptyArray.splice,
			indexOf: emptyArray.indexOf,
			concat: function(){
				var i, value, args = []
				for (i = 0; i < arguments.length; i++) {
					value = arguments[i]
					args[i] = zepto.isZ(value) ? value.toArray() : value
				}
				return concat.apply(zepto.isZ(this) ? this.toArray() : this, args)
			},

			// `map` and `slice` in the jQuery API work differently
			// from their array counterparts
			map: function(fn){
				return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
			},
			slice: function(){
				return $(slice.apply(this, arguments))
			},

			ready: function(callback){
				// need to check if document.body exists for IE as that browser reports
				// document ready when it hasn't yet created the body element
				if (readyRE.test(document.readyState) && document.body) callback($)
				else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
				return this
			},
			get: function(idx){
				return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
			},
			toArray: function(){ return this.get() },
			size: function(){
				return this.length
			},
			remove: function(){
				return this.each(function(){
					if (this.parentNode != null)
						this.parentNode.removeChild(this)
				})
			},
			each: function(callback){
				emptyArray.every.call(this, function(el, idx){
					return callback.call(el, idx, el) !== false
				})
				return this
			},
			filter: function(selector){
				if (isFunction(selector)) return this.not(this.not(selector))
				return $(filter.call(this, function(element){
					return zepto.matches(element, selector)
				}))
			},
			add: function(selector,context){
				return $(uniq(this.concat($(selector,context))))
			},
			is: function(selector){
				return this.length > 0 && zepto.matches(this[0], selector)
			},
			not: function(selector){
				var nodes=[]
				if (isFunction(selector) && selector.call !== undefined)
					this.each(function(idx){
						if (!selector.call(this,idx)) nodes.push(this)
					})
				else {
					var excludes = typeof selector == 'string' ? this.filter(selector) :
						(likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
					this.forEach(function(el){
						if (excludes.indexOf(el) < 0) nodes.push(el)
					})
				}
				return $(nodes)
			},
			has: function(selector){
				return this.filter(function(){
					return isObject(selector) ?
						$.contains(this, selector) :
						$(this).find(selector).size()
				})
			},
			eq: function(idx){
				return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
			},
			first: function(){
				var el = this[0]
				return el && !isObject(el) ? el : $(el)
			},
			last: function(){
				var el = this[this.length - 1]
				return el && !isObject(el) ? el : $(el)
			},
			find: function(selector){
				var result, $this = this
				if (!selector) result = $()
				else if (typeof selector == 'object')
					result = $(selector).filter(function(){
						var node = this
						return emptyArray.some.call($this, function(parent){
							return $.contains(parent, node)
						})
					})
				else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
				else result = this.map(function(){ return zepto.qsa(this, selector) })
				return result
			},
			closest: function(selector, context){
				var nodes = [], collection = typeof selector == 'object' && $(selector)
				this.each(function(_, node){
					while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
						node = node !== context && !isDocument(node) && node.parentNode
					if (node && nodes.indexOf(node) < 0) nodes.push(node)
				})
				return $(nodes)
			},
			parents: function(selector){
				var ancestors = [], nodes = this
				while (nodes.length > 0)
					nodes = $.map(nodes, function(node){
						if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
							ancestors.push(node)
							return node
						}
					})
				return filtered(ancestors, selector)
			},
			parent: function(selector){
				return filtered(uniq(this.pluck('parentNode')), selector)
			},
			children: function(selector){
				return filtered(this.map(function(){ return children(this) }), selector)
			},
			contents: function() {
				return this.map(function() { return this.contentDocument || slice.call(this.childNodes) })
			},
			siblings: function(selector){
				return filtered(this.map(function(i, el){
					return filter.call(children(el.parentNode), function(child){ return child!==el })
				}), selector)
			},
			empty: function(){
				return this.each(function(){ this.innerHTML = '' })
			},
			// `pluck` is borrowed from Prototype.js
			pluck: function(property){
				return $.map(this, function(el){ return el[property] })
			},
			show: function(){
				return this.each(function(){
					this.style.display == "none" && (this.style.display = '')
					if (getComputedStyle(this, '').getPropertyValue("display") == "none")
						this.style.display = defaultDisplay(this.nodeName)
				})
			},
			replaceWith: function(newContent){
				return this.before(newContent).remove()
			},
			wrap: function(structure){
				var func = isFunction(structure)
				if (this[0] && !func)
					var dom   = $(structure).get(0),
						clone = dom.parentNode || this.length > 1

				return this.each(function(index){
					$(this).wrapAll(
						func ? structure.call(this, index) :
							clone ? dom.cloneNode(true) : dom
					)
				})
			},
			wrapAll: function(structure){
				if (this[0]) {
					$(this[0]).before(structure = $(structure))
					var children
					// drill down to the inmost element
					while ((children = structure.children()).length) structure = children.first()
					$(structure).append(this)
				}
				return this
			},
			wrapInner: function(structure){
				var func = isFunction(structure)
				return this.each(function(index){
					var self = $(this), contents = self.contents(),
						dom  = func ? structure.call(this, index) : structure
					contents.length ? contents.wrapAll(dom) : self.append(dom)
				})
			},
			unwrap: function(){
				this.parent().each(function(){
					$(this).replaceWith($(this).children())
				})
				return this
			},
			clone: function(){
				return this.map(function(){ return this.cloneNode(true) })
			},
			hide: function(){
				return this.css("display", "none")
			},
			toggle: function(setting){
				return this.each(function(){
					var el = $(this)
						;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
				})
			},
			prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
			next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
			html: function(html){
				return 0 in arguments ?
					this.each(function(idx){
						var originHtml = this.innerHTML
						$(this).empty().append( funcArg(this, html, idx, originHtml) )
					}) :
					(0 in this ? this[0].innerHTML : null)
			},
			text: function(text){
				return 0 in arguments ?
					this.each(function(idx){
						var newText = funcArg(this, text, idx, this.textContent)
						this.textContent = newText == null ? '' : ''+newText
					}) :
					(0 in this ? this.pluck('textContent').join("") : null)
			},
			attr: function(name, value){
				var result
				return (typeof name == 'string' && !(1 in arguments)) ?
					(0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined) :
					this.each(function(idx){
						if (this.nodeType !== 1) return
						if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
						else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
					})
			},
			removeAttr: function(name){
				return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
					setAttribute(this, attribute)
				}, this)})
			},
			prop: function(name, value){
				name = propMap[name] || name
				return (1 in arguments) ?
					this.each(function(idx){
						this[name] = funcArg(this, value, idx, this[name])
					}) :
					(this[0] && this[0][name])
			},
			removeProp: function(name){
				name = propMap[name] || name
				return this.each(function(){ delete this[name] })
			},
			data: function(name, value){
				var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

				var data = (1 in arguments) ?
					this.attr(attrName, value) :
					this.attr(attrName)

				return data !== null ? deserializeValue(data) : undefined
			},
			val: function(value){
				if (0 in arguments) {
					if (value == null) value = ""
					return this.each(function(idx){
						this.value = funcArg(this, value, idx, this.value)
					})
				} else {
					return this[0] && (this[0].multiple ?
							$(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
							this[0].value)
				}
			},
			offset: function(coordinates){
				if (coordinates) return this.each(function(index){
					var $this = $(this),
						coords = funcArg(this, coordinates, index, $this.offset()),
						parentOffset = $this.offsetParent().offset(),
						props = {
							top:  coords.top  - parentOffset.top,
							left: coords.left - parentOffset.left
						}

					if ($this.css('position') == 'static') props['position'] = 'relative'
					$this.css(props)
				})
				if (!this.length) return null
				if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0]))
					return {top: 0, left: 0}
				var obj = this[0].getBoundingClientRect()
				return {
					left: obj.left + window.pageXOffset,
					top: obj.top + window.pageYOffset,
					width: Math.round(obj.width),
					height: Math.round(obj.height)
				}
			},
			css: function(property, value){
				if (arguments.length < 2) {
					var element = this[0]
					if (typeof property == 'string') {
						if (!element) return
						return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property)
					} else if (isArray(property)) {
						if (!element) return
						var props = {}
						var computedStyle = getComputedStyle(element, '')
						$.each(property, function(_, prop){
							props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
						})
						return props
					}
				}

				var css = ''
				if (type(property) == 'string') {
					if (!value && value !== 0)
						this.each(function(){ this.style.removeProperty(dasherize(property)) })
					else
						css = dasherize(property) + ":" + maybeAddPx(property, value)
				} else {
					for (key in property)
						if (!property[key] && property[key] !== 0)
							this.each(function(){ this.style.removeProperty(dasherize(key)) })
						else
							css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
				}

				return this.each(function(){ this.style.cssText += ';' + css })
			},
			index: function(element){
				return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
			},
			hasClass: function(name){
				if (!name) return false
				return emptyArray.some.call(this, function(el){
					return this.test(className(el))
				}, classRE(name))
			},
			addClass: function(name){
				if (!name) return this
				return this.each(function(idx){
					if (!('className' in this)) return
					classList = []
					var cls = className(this), newName = funcArg(this, name, idx, cls)
					newName.split(/\s+/g).forEach(function(klass){
						if (!$(this).hasClass(klass)) classList.push(klass)
					}, this)
					classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
				})
			},
			removeClass: function(name){
				return this.each(function(idx){
					if (!('className' in this)) return
					if (name === undefined) return className(this, '')
					classList = className(this)
					funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
						classList = classList.replace(classRE(klass), " ")
					})
					className(this, classList.trim())
				})
			},
			toggleClass: function(name, when){
				if (!name) return this
				return this.each(function(idx){
					var $this = $(this), names = funcArg(this, name, idx, className(this))
					names.split(/\s+/g).forEach(function(klass){
						(when === undefined ? !$this.hasClass(klass) : when) ?
							$this.addClass(klass) : $this.removeClass(klass)
					})
				})
			},
			scrollTop: function(value){
				if (!this.length) return
				var hasScrollTop = 'scrollTop' in this[0]
				if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
				return this.each(hasScrollTop ?
					function(){ this.scrollTop = value } :
					function(){ this.scrollTo(this.scrollX, value) })
			},
			scrollLeft: function(value){
				if (!this.length) return
				var hasScrollLeft = 'scrollLeft' in this[0]
				if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
				return this.each(hasScrollLeft ?
					function(){ this.scrollLeft = value } :
					function(){ this.scrollTo(value, this.scrollY) })
			},
			position: function() {
				if (!this.length) return

				var elem = this[0],
					// Get *real* offsetParent
					offsetParent = this.offsetParent(),
					// Get correct offsets
					offset       = this.offset(),
					parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

				// Subtract element margins
				// note: when an element has margin: auto the offsetLeft and marginLeft
				// are the same in Safari causing offset.left to incorrectly be 0
				offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
				offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

				// Add offsetParent borders
				parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
				parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

				// Subtract the two offsets
				return {
					top:  offset.top  - parentOffset.top,
					left: offset.left - parentOffset.left
				}
			},
			offsetParent: function() {
				return this.map(function(){
					var parent = this.offsetParent || document.body
					while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
						parent = parent.offsetParent
					return parent
				})
			}
		}

		// for now
		$.fn.detach = $.fn.remove

		// Generate the `width` and `height` functions
		;['width', 'height'].forEach(function(dimension){
			var dimensionProperty =
				dimension.replace(/./, function(m){ return m[0].toUpperCase() })

			$.fn[dimension] = function(value){
				var offset, el = this[0]
				if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
					isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
					(offset = this.offset()) && offset[dimension]
				else return this.each(function(idx){
					el = $(this)
					el.css(dimension, funcArg(this, value, idx, el[dimension]()))
				})
			}
		})

		function traverseNode(node, fun) {
			fun(node)
			for (var i = 0, len = node.childNodes.length; i < len; i++)
				traverseNode(node.childNodes[i], fun)
		}

		// Generate the `after`, `prepend`, `before`, `append`,
		// `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
		adjacencyOperators.forEach(function(operator, operatorIndex) {
			var inside = operatorIndex % 2 //=> prepend, append

			$.fn[operator] = function(){
				// arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
				var argType, nodes = $.map(arguments, function(arg) {
						var arr = []
						argType = type(arg)
						if (argType == "array") {
							arg.forEach(function(el) {
								if (el.nodeType !== undefined) return arr.push(el)
								else if ($.zepto.isZ(el)) return arr = arr.concat(el.get())
								arr = arr.concat(zepto.fragment(el))
							})
							return arr
						}
						return argType == "object" || arg == null ?
							arg : zepto.fragment(arg)
					}),
					parent, copyByClone = this.length > 1
				if (nodes.length < 1) return this

				return this.each(function(_, target){
					parent = inside ? target : target.parentNode

					// convert all methods to a "before" operation
					target = operatorIndex == 0 ? target.nextSibling :
						operatorIndex == 1 ? target.firstChild :
							operatorIndex == 2 ? target :
								null

					var parentInDocument = $.contains(document.documentElement, parent)

					nodes.forEach(function(node){
						if (copyByClone) node = node.cloneNode(true)
						else if (!parent) return $(node).remove()

						parent.insertBefore(node, target)
						if (parentInDocument) traverseNode(node, function(el){
							if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
								(!el.type || el.type === 'text/javascript') && !el.src){
								var target = el.ownerDocument ? el.ownerDocument.defaultView : window
								target['eval'].call(target, el.innerHTML)
							}
						})
					})
				})
			}

			// after    => insertAfter
			// prepend  => prependTo
			// before   => insertBefore
			// append   => appendTo
			$.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
				$(html)[operator](this)
				return this
			}
		})

		zepto.Z.prototype = Z.prototype = $.fn

		// Export internal API functions in the `$.zepto` namespace
		zepto.uniq = uniq
		zepto.deserializeValue = deserializeValue
		$.zepto = zepto

		return $
	})()

	// If `$` is not yet defined, point it to `Zepto`
	window.Zepto = Zepto
	window.$ === undefined && (window.$ = Zepto)
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	;(function($){
		var _zid = 1, undefined,
			slice = Array.prototype.slice,
			isFunction = $.isFunction,
			isString = function(obj){ return typeof obj == 'string' },
			handlers = {},
			specialEvents={},
			focusinSupported = 'onfocusin' in window,
			focus = { focus: 'focusin', blur: 'focusout' },
			hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

		specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

		function zid(element) {
			return element._zid || (element._zid = _zid++)
		}
		function findHandlers(element, event, fn, selector) {
			event = parse(event)
			if (event.ns) var matcher = matcherFor(event.ns)
			return (handlers[zid(element)] || []).filter(function(handler) {
				return handler
					&& (!event.e  || handler.e == event.e)
					&& (!event.ns || matcher.test(handler.ns))
					&& (!fn       || zid(handler.fn) === zid(fn))
					&& (!selector || handler.sel == selector)
			})
		}
		function parse(event) {
			var parts = ('' + event).split('.')
			return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
		}
		function matcherFor(ns) {
			return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
		}

		function eventCapture(handler, captureSetting) {
			return handler.del &&
				(!focusinSupported && (handler.e in focus)) ||
				!!captureSetting
		}

		function realEvent(type) {
			return hover[type] || (focusinSupported && focus[type]) || type
		}

		function add(element, events, fn, data, selector, delegator, capture){
			var id = zid(element), set = (handlers[id] || (handlers[id] = []))
			events.split(/\s/).forEach(function(event){
				if (event == 'ready') return $(document).ready(fn)
				var handler   = parse(event)
				handler.fn    = fn
				handler.sel   = selector
				// emulate mouseenter, mouseleave
				if (handler.e in hover) fn = function(e){
					var related = e.relatedTarget
					if (!related || (related !== this && !$.contains(this, related)))
						return handler.fn.apply(this, arguments)
				}
				handler.del   = delegator
				var callback  = delegator || fn
				handler.proxy = function(e){
					e = compatible(e)
					if (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) return
					e.data = data
					var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
					if (result === false) e.preventDefault(), e.stopPropagation()
					return result
				}
				handler.i = set.length
				set.push(handler)
				if ('addEventListener' in element)
					element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
			})
		}
		function remove(element, events, fn, selector, capture){
			var id = zid(element)
				;(events || '').split(/\s/).forEach(function(event){
				findHandlers(element, event, fn, selector).forEach(function(handler){
					delete handlers[id][handler.i]
					if ('removeEventListener' in element)
						element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
				})
			})
		}

		$.event = { add: add, remove: remove }

		$.proxy = function(fn, context) {
			var args = (2 in arguments) && slice.call(arguments, 2)
			if (isFunction(fn)) {
				var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
				proxyFn._zid = zid(fn)
				return proxyFn
			} else if (isString(context)) {
				if (args) {
					args.unshift(fn[context], fn)
					return $.proxy.apply(null, args)
				} else {
					return $.proxy(fn[context], fn)
				}
			} else {
				throw new TypeError("expected function")
			}
		}

		$.fn.bind = function(event, data, callback){
			return this.on(event, data, callback)
		}
		$.fn.unbind = function(event, callback){
			return this.off(event, callback)
		}
		$.fn.one = function(event, selector, data, callback){
			return this.on(event, selector, data, callback, 1)
		}

		var returnTrue = function(){return true},
			returnFalse = function(){return false},
			ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
			eventMethods = {
				preventDefault: 'isDefaultPrevented',
				stopImmediatePropagation: 'isImmediatePropagationStopped',
				stopPropagation: 'isPropagationStopped'
			}

		function compatible(event, source) {
			if (source || !event.isDefaultPrevented) {
				source || (source = event)

				$.each(eventMethods, function(name, predicate) {
					var sourceMethod = source[name]
					event[name] = function(){
						this[predicate] = returnTrue
						return sourceMethod && sourceMethod.apply(source, arguments)
					}
					event[predicate] = returnFalse
				})

				event.timeStamp || (event.timeStamp = Date.now())

				if (source.defaultPrevented !== undefined ? source.defaultPrevented :
						'returnValue' in source ? source.returnValue === false :
						source.getPreventDefault && source.getPreventDefault())
					event.isDefaultPrevented = returnTrue
			}
			return event
		}

		function createProxy(event) {
			var key, proxy = { originalEvent: event }
			for (key in event)
				if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

			return compatible(proxy, event)
		}

		$.fn.delegate = function(selector, event, callback){
			return this.on(event, selector, callback)
		}
		$.fn.undelegate = function(selector, event, callback){
			return this.off(event, selector, callback)
		}

		$.fn.live = function(event, callback){
			$(document.body).delegate(this.selector, event, callback)
			return this
		}
		$.fn.die = function(event, callback){
			$(document.body).undelegate(this.selector, event, callback)
			return this
		}

		$.fn.on = function(event, selector, data, callback, one){
			var autoRemove, delegator, $this = this
			if (event && !isString(event)) {
				$.each(event, function(type, fn){
					$this.on(type, selector, data, fn, one)
				})
				return $this
			}

			if (!isString(selector) && !isFunction(callback) && callback !== false)
				callback = data, data = selector, selector = undefined
			if (callback === undefined || data === false)
				callback = data, data = undefined

			if (callback === false) callback = returnFalse

			return $this.each(function(_, element){
				if (one) autoRemove = function(e){
					remove(element, e.type, callback)
					return callback.apply(this, arguments)
				}

				if (selector) delegator = function(e){
					var evt, match = $(e.target).closest(selector, element).get(0)
					if (match && match !== element) {
						evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
						return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
					}
				}

				add(element, event, callback, data, selector, delegator || autoRemove)
			})
		}
		$.fn.off = function(event, selector, callback){
			var $this = this
			if (event && !isString(event)) {
				$.each(event, function(type, fn){
					$this.off(type, selector, fn)
				})
				return $this
			}

			if (!isString(selector) && !isFunction(callback) && callback !== false)
				callback = selector, selector = undefined

			if (callback === false) callback = returnFalse

			return $this.each(function(){
				remove(this, event, callback, selector)
			})
		}

		$.fn.trigger = function(event, args){
			event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
			event._args = args
			return this.each(function(){
				// handle focus(), blur() by calling them directly
				if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
				// items in the collection might not be DOM elements
				else if ('dispatchEvent' in this) this.dispatchEvent(event)
				else $(this).triggerHandler(event, args)
			})
		}

		// triggers event handlers on current element just as if an event occurred,
		// doesn't trigger an actual event, doesn't bubble
		$.fn.triggerHandler = function(event, args){
			var e, result
			this.each(function(i, element){
				e = createProxy(isString(event) ? $.Event(event) : event)
				e._args = args
				e.target = element
				$.each(findHandlers(element, event.type || event), function(i, handler){
					result = handler.proxy(e)
					if (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) return false
				})
			})
			return result
		}

		// shortcut methods for `.bind(event, fn)` for each event type
		;('focusin focusout focus blur load resize scroll unload click dblclick '+
		'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
		'change select keydown keypress keyup error').split(' ').forEach(function(event) {
			$.fn[event] = function(callback) {
				return (0 in arguments) ?
					this.bind(event, callback) :
					this.trigger(event)
			}
		})

		$.Event = function(type, props) {
			if (!isString(type)) props = type, type = props.type
			var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
			if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
			event.initEvent(type, bubbles, true)
			return compatible(event)
		}

	})(Zepto)
	var x = Zepto;

	// Zepto extensions
	x.fn.innerText = function(){
		if (!(0 in this)) { return null; }
		if (document.createTreeWalker && NodeFilter) {
			return $.map(this, function(el) {
				var node, text=[]; walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
				while (node = walker.nextNode()) {
					text.push(node.nodeValue);
				}
				return text.join(" ");
			}).join(" ").replace(/\n+/g," ");
		}
		else {
			$.map(this, function (el) {
				return el['textContent']
			}).join(" ").replace(/\n+/g, " ");
		}
	};

	// Are we running in the page context or extension context?
	x.pagecontext = args.pagecontext || false;
	
	// Set an attribute on an Object using a possible deeply-nested path
	// Stole this from lodash _.set(object, path, value)
	x.set=(function(){var h='[object Array]',g='[object Function]',p='[object String]';var k=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,m=/^\w*$/,l=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;var o=/\\(\\)?/g;var q=/^\d+$/;function n(b){return b==null?'':(b+'')}function f(b){return!!b&&typeof b=='object'}var j=Object.prototype;var b=j.toString;var d=9007199254740991;function r(b,c){b=(typeof b=='number'||q.test(b))?+b:-1;c=c==null?d:c;return b>-1&&b%1==0&&b<c}function t(b,d){var c=typeof b;if((c=='string'&&m.test(b))||c=='number'){return true}if(e(b)){return false}var f=!k.test(b);return f||(d!=null&&b in i(d))}function v(b){return typeof b=='number'&&b>-1&&b%1==0&&b<=d}function i(b){return c(b)?b:Object(b)}function s(b){if(e(b)){return b}var c=[];n(b).replace(l,function(d,b,f,e){c.push(f?e.replace(o,'$1'):(b||d))});return c}var e=function(c){return f(c)&&v(c.length)&&b.call(c)==h};function w(d){return c(d)&&b.call(d)==g}function c(c){var b=typeof c;return!!c&&(b=='object'||b=='function')}function x(c){return typeof c=='string'||(f(c)&&b.call(c)==p)}function u(e,d,k){if(e==null){return e}var i=(d+'');d=(e[i]!=null||t(d,e))?[i]:s(d);var f=-1,h=d.length,j=h-1,b=e;while(b!=null&&++f<h){var g=d[f];if(c(b)){if(f==j){b[g]=k}else if(b[g]==null){b[g]=r(d[f+1])?[]:{}}}b=b[g]}return e}return u})();
	
	// Test if a property is defined.
	x.def=function(o) {
		return typeof o!="undefined";
	};
	
	// Simple Pub/Sub
	x.pubsub_handlers = {};
	x.pubsub_messages = {}; // A list of all messages
	x.publish = function(event,data,republish,persist_messages) {
		if (typeof republish!="boolean") { republish=true; }
		if (typeof persist_messages!="boolean") { persist_messages=true; }
		data = data || {};
		var funcs = x.pubsub_handlers[event];
		if (funcs) {
			funcs.forEach(function(f) {
				try {
					f.call(x,event,data);
				} catch(e) {
					console.log(e);
				}
			});
		}
		// If we are running in the page context, send a message back to the extension code
		if (republish) {
			// Clone data before posting, to make sure that object references are not passed
			window.postMessage( {"sfx":true, "pagecontext":x.pagecontext, "message": { "event":event, "data":x.clone(data) } } , "*");
		}
		// Store this message in case a subscriber appears later and wants all past messages?
		if (persist_messages) {
			x.pubsub_messages[event] = x.pubsub_messages[event] || [];
			var messages = x.pubsub_messages[event];
			messages.push( {"event":event, "data":data} );
		}
	};
	// TODO: Wildcard subscriptions
	x.subscribe = function(event,func,receive_past_messages) {
		if (typeof receive_past_messages!="boolean") { receive_past_messages=false; }
		var events = (typeof event=="string") ? [event] : event;
		events.forEach(function(ev) {
			if (typeof x.pubsub_handlers[ev]=="undefined") {
				x.pubsub_handlers[ev]=[];
			}
			x.pubsub_handlers[ev].push(func);
			// If past messages are requested, fire this function for each of the past messages
			if (receive_past_messages) {
				var messages = x.pubsub_messages[ev];
				if (typeof messages!="undefined") {
					messages.forEach(function(msg) {
						func.call(x,msg.event,msg.data);
					});
				}
			}
		});
	};
	// Allow for passing of messages between extension and page contexts, using window.postMessage
	window.addEventListener('message', function(event) {
		if (event.data.sfx && event.data.pagecontext!=x.pagecontext) {
			// A message has been received from the other context
			x.publish(event.data.message.event, event.data.message.data, false);
		}
	});

	// A Generalized storage/persistence mechanism
	var ls = window.localStorage;
	x.storage = {
		"prefix":null,
		"data":{}, // keys are options, stats, etc
		"set":function(key,prop,val,callback,save) {
			// update stored value in memory
			if (typeof x.storage.data[key]=="undefined") {
				x.storage.data[key] = {};
			}
			var container = x.storage.data[key];
			// Single value set
			if (typeof prop=="string" && (typeof callback=="undefined"||typeof callback=="function"||callback==null)) {
				x.storage.set_or_delete(container,prop,val);
			}
			// Multiset
			else if (typeof prop=="object" && (typeof val=="undefined"||typeof val=="function")) {
				save=callback;
				callback = val;
				var prop2;
				for (prop2 in prop) {
					x.storage.set_or_delete(container,prop2,prop[prop2]);
				}
			}
			if (false!==save) {
				x.storage.save(key, null, callback);
			}
			else if (typeof callback=="function") {
				callback(key,null);
			}
		},
		"set_or_delete":function(container,prop,val) {
			// Delete a value by setting it to undefined
			if (prop in container && typeof val=="undefined") {
				delete container[prop];
			}
			else {
				x.set(container, prop, val);
			}
		},
		"save":function(key,val,callback) {
			if (val==null && typeof x.storage.data[key]!="undefined") {
				val = x.storage.data[key];
			}
			else {
				x.storage.data[key] = val;
			}
			// persist
			Extension.storage.set(key, val, function(key,val,ret) {
				// post to localstorage to trigger updates in other windows
				var o = {"time":x.now(), "key":key};
				ls.setItem('x-storage', JSON.stringify(o));
				// Call the callback
				if (typeof callback=="function") { callback(key,val,ret); }
			}, (x.storage.prefix!=null?x.storage.prefix+'/':'') );
		},
		"get":function(keys, defaultValue, callback, use_cache) {
			if (!!use_cache && typeof keys=="string" && typeof x.storage.data[keys]!="undefined") {
				if (typeof callback=="function") { return callback(x.storage.data[keys]); }
			}
			// TODO: Get multi values from cache!
			Extension.storage.get(keys, defaultValue, function(values) {
				var key, i;
				// Store the data in memory
				if (typeof keys=="string") {
					// Single value
					if (typeof x.storage.data[keys]=="undefined") {
						x.storage.update(keys, values);
					}
				}
				else {
					// Multi value
					for (i=0; i<keys.length; i++) {
						key = keys[i];
						x.storage.update(key,values[key]);
					}
				}
				if (typeof callback=="function") {
					callback(values);
				}
			}, (x.storage.prefix!=null?x.storage.prefix+'/':'') );
		},
		"refresh":function(key,callback) {
			if (typeof x.storage.data[key]!="undefined") {
				x.storage.get(key, null, callback, false);
			}
		}
		,"update":function(key,value) {
			x.storage.data[key] = value;
		}
	};
	// Use localStorage to communicate storage changes between windows and tabs.
	// Changes to localStorage trigger the 'storage' event in other windows on the same site.
	if (!x.pagecontext) {
		window.addEventListener('storage', function (e) {
			if ("x-storage"==e.key) {
				try {
					var json = JSON.parse(e.newValue); // {"time":123,"key":"key_name"}
					x.storage.refresh(json.key, function(data) {
						// Publish a message
						x.publish("storage/refresh", {"key":json.key,"data":data})
					});
				} catch(err) {
					console.log(err);
				}
			}
		},true);
	}

	// Sanitize HTML using the DOMPurify library, if available
	x.sanitize = function(html) {
		return (typeof DOMPurify!="undefined" ? DOMPurify.sanitize(html) : html);
	};
	x.fn.safe_html = function(html) {
		html = x.sanitize(html);
		return this.each(function(){ this.html(html); });
	};


	// http/ajax
	x.ajax = function(urlOrObject,callback) {
		// TODO: Allow for ajax from pagecontext
		Extension.ajax(urlOrObject,function(content,status,headers) {
			if (headers && 'application/json'==headers['content-type']) {
				content = JSON.parse(content);
			}
			callback(content,status);
		});
	};
	
	// css
	x.css = function(css,id) {
		x.when('head',function($head) {
			var s;
			if (id) {
				s = document.getElementById(id);
				if (s) {
					if (css) {
						s.textContent = css;
					}
					else {
						x(s).remove();
					}
					return;
				}
			}
			s = document.createElement('style');
			s.textContent = css;
			if (id) {
				s.id=id;
			}
			$head.append(s);
		});

	};
	
	// function execution in a <script> block (in page context)
	x.inject = function(code,args,windowVar) {
		if (!document || !document.createElement || !document.documentElement || !document.documentElement.appendChild) { return false; }
		var s = document.createElement('script');
		s.type = 'text/javascript';
		args = JSON.stringify(args||{});
		var result = windowVar?'window.'+windowVar+'=':'';
		code = result+'('+code.toString()+')('+args+');';
		if (windowVar) {
			// Post a window notification saying this variable is now defined
			code += 'window.postMessage({"sfxready":"'+windowVar+'"} , "*");';
		}
		s.text = code;
		document.documentElement.appendChild(s);
		s.parentNode.removeChild(s);
		return true;
	};
	
	// POLLING
	// Call a function repeatedly until it doesn't throw an exception or returns non-false
	x.poll = function(func,interval,max){
		interval=interval||500;
		max=max||50;
		var count=0;
		var f=function(){
			if(count++>max){return;}
			try{
				if (func(count)===false){ 
					setTimeout(f,interval); 
				}
			}
			catch(e){
				setTimeout(f,interval);
			}
		};
		f();
	};
	// A function that executes a function only when a selector returns a result
	x.when = function(selector, func) {
		var $results = x(selector);
		if ($results.length>0) {
			func($results);
		}
		else {
			setTimeout(function() {
				x.when(selector,func);
			},200);
		}
	};

	// Cookies
	x.cookie = {
		'get':function(n) { 
			try { 
				return unescape(document.cookie.match('(^|;)?'+n+'=([^;]*)(;|$)')[2]); 
			} catch(e) { 
				return null; 
			} 
		},
		'set':function() {}
	};
	
	// Logging
	x.log = function(){
		if (console && console.log) {
			var args = [];
			for (var i = 0; i < arguments.length; i++) {
				if (typeof arguments[i] == "object") {
					args.push(JSON.stringify(arguments[i], null, 3));
				}
				else {
					args.push(arguments[i]);
				}
			}
			console.log.apply(console,args);
		}
	};
	x.alert = function(msg) {
		if (typeof msg=="object") { msg=JSON.stringify(msg,null,3); }
		alert(msg);
	};

	// A "bind" function to support event capture mode
	x.bind = function(el, ev, func, capture) {
		if (typeof el == "string") {
			el = x(el);
			if (!el || el.length<1) { return ; }
			el = el[0];
		}
		else {
			el = X(el)[0];
		}
		if (typeof capture != "boolean") {
			capture = false;
		}
		if (el && el.addEventListener) {
			el.addEventListener(ev, func, capture);
		}
	};
	x.capture = function(el,ev,func) {
		x.bind(el,ev,func,true);
	};

	// A backwards-compatible replacement for the old QSA() function
	x.QSA = function(selector,func) {
		x(selector).each(function() {
			func(this);
		});
	};
	
	// A util method to find a single element matching a selector
	x.find = function(selector) {
		var o = x(selector);
		return (o.length>0) ? o[0] : null;
	};
	
	// Find the real target of an event
	x.target = function(e,wrap){ var t=e.target; if (t.nodeType == 3){t=t.parentNode;} return wrap?x(t):t; };
	x.parent = function(el){ if(el&&el.parentNode) { return el.parentNode; } return null; };

	// A util method to clone a simple object
	x.clone = function(o) { return JSON.parse(JSON.stringify(o)); };

	// Some useful string methods
	x.match = function (str, regex, func) {
		if (typeof str != "string") {
			return null;
		}
		var m = str.match(regex);
		if (m && m.length) {
			if (typeof func == "function") {
				for (var i = regex.global ? 0 : 1; i < m.length; i++) {
					func(m[i]);
				}
				return m;
			} else {
				return m.length > 1 ? m[regex.global ? 0 : 1] : null;
			}
		}
		return null;
	};

	// Get a timestamp
	x.time = function() { return Date.now(); };
	x.now = x.time;
	// Express a timestamp as a relative time "ago"
	x.ago = function(when, now, shortened, higher_resolution) {
		now = now || x.now();
		if (typeof shortened!="boolean") { shortened=true; }
		var diff = "";
		var delta = (now - when);
		var seconds = delta / x.seconds;
		if (seconds < 60) {
			return "just now";
		}
		var days = Math.floor(delta / x.days);
		if (days > 0) {
			diff += days+" day"+(days>1?"s":"")+" ";
			delta -= (days*x.days);
		}

		var hours = Math.floor(delta / x.hours );
		if (hours>0 && (higher_resolution || !diff)) {
			diff += hours + " " + (shortened ? "hr" : "hours")+" ";
			delta -= (hours*x.hours);
		}

		var minutes = Math.floor(delta / x.minutes);
		if (minutes>0 && (!diff || (higher_resolution && days<1))) {
			diff += minutes + " " + (shortened ? "mins" : "minutes") + " ";
		}
		if (!diff) {
			diff = "a while ";
		}
		return diff+"ago";
	};

	// Recurring tasks execute only at certain intervals
	x.seconds = 1000;
	x.minutes = x.seconds * 60;
	x.hours = x.minutes * 60;
	x.days = x.hours * 24;
	x.task = function(key, frequency, callback) {
		// Internally store the state of each task in a user pref
		x.storage.get('tasks',{},function(tasks) {
			if (typeof tasks[key]=="undefined") {
				tasks[key] = {"run_on": null};
			}
			var t = tasks[key];
			var now = x.now();
			// If we are past due, update the task and execute the callback
			if (!t.run_on || ((t.run_on+frequency) < now)) {
				t.run_on = now;
				x.storage.set('tasks',key, t, function() {
					callback();
				});
			}
		},true);
	};

	// Semver Compare
	x.semver_compare = function (a, b) {
		var pa = a.split('.');
		var pb = b.split('.');
		for (var i = 0; i < 3; i++) {
			var na = Number(pa[i]);
			var nb = Number(pb[i]);
			if (na > nb) return 1;
			if (nb > na) return -1;
			if (!isNaN(na) && isNaN(nb)) return 1;
			if (isNaN(na) && !isNaN(nb)) return -1;
		}
		return 0;
	};

	// UI methods to simulate user actions
	x.ui = {
		"click": function(selector,bubble) {
			if (typeof bubble != "boolean") {
				bubble = true;
			}
			x(selector).each(function() {
				var e = document.createEvent('MouseEvents');
				e.initEvent('click', bubble, true, window, 0);
				this.dispatchEvent(e);
			});
		},
		"keypress": function(selector,code,type) {
			type = type || "keypress";
			x(selector).each(function() {
				var e = document.createEvent('KeyboardEvent');
				if (typeof code == "string") {
					code = code.charCodeAt(0);
				}
				if (e.initKeyboardEvent) {
					e.initKeyboardEvent(type, true, true, window, code, null, null);
				}
				else if (e.initKeyEvent) {
					e.initKeyEvent(type, true, true, window, false, false, false, false, false, code);
				}
				this.dispatchEvent(e);
			});
		},
		"scroll":function(pixels,el) {
			var $el = X(el || window);
			var scrollTop = $el.scrollTop();
			if (typeof scrollTop=="number") {
				$el.scrollTop(scrollTop+pixels);
			}
		}
	};

	// Draggable Objects
	x.draggable = function(el,dragend) {
		var $el = X(el);
		el = $el[0];
		$el.attr('draggable',true);
		var $undraggables = $el.find('*[draggable="false"]');
		if ($undraggables.length>0) {
			$undraggables.css({'cursor': 'auto'}).mousedown(function() {$el.attr('draggable',false);}).mouseup(function(e) {$el.attr('draggable',true);});
		}
		$el.on('dragstart',function(ev) {
			x.draggable.dragend = dragend;
			ev.dataTransfer.setData("text/plain",(el.offsetLeft - ev.clientX) + ',' + (el.offsetTop - ev.clientY));
			x.draggable.target = el;
		});
	};
	x.draggable.target = null;
	x.draggable.dragend = null;
	x(window).on('dragover',function(ev) {
		if (x.draggable.target) {
			ev.preventDefault();
			return false;
		}
	}).on('drop',function(ev){
		if (x.draggable.target) {
			var offset = ev.dataTransfer.getData("text/plain").split(',');
			var $el = x(x.draggable.target);
			var left = (ev.clientX + +offset[0]);
			if (left<0) { left=0; }
			var top = (ev.clientY + +offset[1]);
			if (top<0) { top=0; }
			$el.css('left', left + 'px');
			$el.css('top', top + 'px');
			$el.css('right', 'auto');
			$el.css('bottom', 'auto');
			ev.preventDefault();
			x.draggable.target = null;
			if (typeof x.draggable.dragend=="function") {
				x.draggable.dragend($el,left,top);
			}
			return false;
		}
	});
	// ELEMENT CREATION
	//
	// Create a document fragment, then optionally run a function with it as an argument
	x.fragment = function(html,func) {
		var frag = document.createDocumentFragment();
		var div = document.createElement('div');
		var selector;
		div.innerHTML = x.sanitize(html);
		while(div && div.firstChild) {
			frag.appendChild( div.firstChild );
		}
		if (typeof func=="function") {
			func(frag);
		}
		else if (typeof func=="object") {
			for (selector in func) {
				click(QS(frag,selector),func[selector],true,true);
			}
		}
		return frag;
	};

	// Observe DOM Changes
	x.on_attribute_change = function(el,attr,callback) {
		(new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (!attr || (mutation.attributeName==attr && el.getAttribute(attr)!=mutation.oldValue)) {
					callback(mutation.attributeName, mutation.oldValue);
				}
			});
		})).observe(el, {attributes: true, attributeOldValue: true});
	};

	x.return_false = function(){return false;}
	
	x.is_document_ready = function() { 
		if(document && document.readyState) { return (document.readyState=="interactive"||document.readyState=="complete") }
		return (document && document.getElementsByTagName && document.getElementsByTagName('BODY').length>0); 
	};
	
	return x;
};
var X = XLib();
/*
// Causes a bug in Facebook Settings when injected. Not needed yet anyway.
X.when('head',function() {
	X.inject(XLib,{pagecontext:true},'X');
});
*/


/*!
 * Vue.js v1.0.26
 * (c) 2016 Evan You
 * Released under the MIT License.
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.Vue=e()}(this,function(){"use strict";function t(e,n,r){if(i(e,n))return void(e[n]=r);if(e._isVue)return void t(e._data,n,r);var s=e.__ob__;if(!s)return void(e[n]=r);if(s.convert(n,r),s.dep.notify(),s.vms)for(var o=s.vms.length;o--;){var a=s.vms[o];a._proxy(n),a._digest()}return r}function e(t,e){if(i(t,e)){delete t[e];var n=t.__ob__;if(!n)return void(t._isVue&&(delete t._data[e],t._digest()));if(n.dep.notify(),n.vms)for(var r=n.vms.length;r--;){var s=n.vms[r];s._unproxy(e),s._digest()}}}function i(t,e){return Oi.call(t,e)}function n(t){return Ti.test(t)}function r(t){var e=(t+"").charCodeAt(0);return 36===e||95===e}function s(t){return null==t?"":t.toString()}function o(t){if("string"!=typeof t)return t;var e=Number(t);return isNaN(e)?t:e}function a(t){return"true"===t?!0:"false"===t?!1:t}function h(t){var e=t.charCodeAt(0),i=t.charCodeAt(t.length-1);return e!==i||34!==e&&39!==e?t:t.slice(1,-1)}function l(t){return t.replace(Ni,c)}function c(t,e){return e?e.toUpperCase():""}function u(t){return t.replace(ji,"$1-$2").toLowerCase()}function f(t){return t.replace(Ei,c)}function p(t,e){return function(i){var n=arguments.length;return n?n>1?t.apply(e,arguments):t.call(e,i):t.call(e)}}function d(t,e){e=e||0;for(var i=t.length-e,n=new Array(i);i--;)n[i]=t[i+e];return n}function v(t,e){for(var i=Object.keys(e),n=i.length;n--;)t[i[n]]=e[i[n]];return t}function m(t){return null!==t&&"object"==typeof t}function g(t){return Si.call(t)===Fi}function _(t,e,i,n){Object.defineProperty(t,e,{value:i,enumerable:!!n,writable:!0,configurable:!0})}function y(t,e){var i,n,r,s,o,a=function h(){var a=Date.now()-s;e>a&&a>=0?i=setTimeout(h,e-a):(i=null,o=t.apply(r,n),i||(r=n=null))};return function(){return r=this,n=arguments,s=Date.now(),i||(i=setTimeout(a,e)),o}}function b(t,e){for(var i=t.length;i--;)if(t[i]===e)return i;return-1}function w(t){var e=function i(){return i.cancelled?void 0:t.apply(this,arguments)};return e.cancel=function(){e.cancelled=!0},e}function C(t,e){return t==e||(m(t)&&m(e)?JSON.stringify(t)===JSON.stringify(e):!1)}function $(t){this.size=0,this.limit=t,this.head=this.tail=void 0,this._keymap=Object.create(null)}function k(){var t,e=en.slice(hn,on).trim();if(e){t={};var i=e.match(vn);t.name=i[0],i.length>1&&(t.args=i.slice(1).map(x))}t&&(nn.filters=nn.filters||[]).push(t),hn=on+1}function x(t){if(mn.test(t))return{value:o(t),dynamic:!1};var e=h(t),i=e===t;return{value:i?t:e,dynamic:i}}function A(t){var e=dn.get(t);if(e)return e;for(en=t,ln=cn=!1,un=fn=pn=0,hn=0,nn={},on=0,an=en.length;an>on;on++)if(sn=rn,rn=en.charCodeAt(on),ln)39===rn&&92!==sn&&(ln=!ln);else if(cn)34===rn&&92!==sn&&(cn=!cn);else if(124===rn&&124!==en.charCodeAt(on+1)&&124!==en.charCodeAt(on-1))null==nn.expression?(hn=on+1,nn.expression=en.slice(0,on).trim()):k();else switch(rn){case 34:cn=!0;break;case 39:ln=!0;break;case 40:pn++;break;case 41:pn--;break;case 91:fn++;break;case 93:fn--;break;case 123:un++;break;case 125:un--}return null==nn.expression?nn.expression=en.slice(0,on).trim():0!==hn&&k(),dn.put(t,nn),nn}function O(t){return t.replace(_n,"\\$&")}function T(){var t=O(An.delimiters[0]),e=O(An.delimiters[1]),i=O(An.unsafeDelimiters[0]),n=O(An.unsafeDelimiters[1]);bn=new RegExp(i+"((?:.|\\n)+?)"+n+"|"+t+"((?:.|\\n)+?)"+e,"g"),wn=new RegExp("^"+i+"((?:.|\\n)+?)"+n+"$"),yn=new $(1e3)}function N(t){yn||T();var e=yn.get(t);if(e)return e;if(!bn.test(t))return null;for(var i,n,r,s,o,a,h=[],l=bn.lastIndex=0;i=bn.exec(t);)n=i.index,n>l&&h.push({value:t.slice(l,n)}),r=wn.test(i[0]),s=r?i[1]:i[2],o=s.charCodeAt(0),a=42===o,s=a?s.slice(1):s,h.push({tag:!0,value:s.trim(),html:r,oneTime:a}),l=n+i[0].length;return l<t.length&&h.push({value:t.slice(l)}),yn.put(t,h),h}function j(t,e){return t.length>1?t.map(function(t){return E(t,e)}).join("+"):E(t[0],e,!0)}function E(t,e,i){return t.tag?t.oneTime&&e?'"'+e.$eval(t.value)+'"':S(t.value,i):'"'+t.value+'"'}function S(t,e){if(Cn.test(t)){var i=A(t);return i.filters?"this._applyFilters("+i.expression+",null,"+JSON.stringify(i.filters)+",false)":"("+t+")"}return e?t:"("+t+")"}function F(t,e,i,n){R(t,1,function(){e.appendChild(t)},i,n)}function D(t,e,i,n){R(t,1,function(){B(t,e)},i,n)}function P(t,e,i){R(t,-1,function(){z(t)},e,i)}function R(t,e,i,n,r){var s=t.__v_trans;if(!s||!s.hooks&&!qi||!n._isCompiled||n.$parent&&!n.$parent._isCompiled)return i(),void(r&&r());var o=e>0?"enter":"leave";s[o](i,r)}function L(t){if("string"==typeof t){t=document.querySelector(t)}return t}function H(t){if(!t)return!1;var e=t.ownerDocument.documentElement,i=t.parentNode;return e===t||e===i||!(!i||1!==i.nodeType||!e.contains(i))}function I(t,e){var i=t.getAttribute(e);return null!==i&&t.removeAttribute(e),i}function M(t,e){var i=I(t,":"+e);return null===i&&(i=I(t,"v-bind:"+e)),i}function V(t,e){return t.hasAttribute(e)||t.hasAttribute(":"+e)||t.hasAttribute("v-bind:"+e)}function B(t,e){e.parentNode.insertBefore(t,e)}function W(t,e){e.nextSibling?B(t,e.nextSibling):e.parentNode.appendChild(t)}function z(t){t.parentNode.removeChild(t)}function U(t,e){e.firstChild?B(t,e.firstChild):e.appendChild(t)}function J(t,e){var i=t.parentNode;i&&i.replaceChild(e,t)}function q(t,e,i,n){t.addEventListener(e,i,n)}function Q(t,e,i){t.removeEventListener(e,i)}function G(t){var e=t.className;return"object"==typeof e&&(e=e.baseVal||""),e}function Z(t,e){Mi&&!/svg$/.test(t.namespaceURI)?t.className=e:t.setAttribute("class",e)}function X(t,e){if(t.classList)t.classList.add(e);else{var i=" "+G(t)+" ";i.indexOf(" "+e+" ")<0&&Z(t,(i+e).trim())}}function Y(t,e){if(t.classList)t.classList.remove(e);else{for(var i=" "+G(t)+" ",n=" "+e+" ";i.indexOf(n)>=0;)i=i.replace(n," ");Z(t,i.trim())}t.className||t.removeAttribute("class")}function K(t,e){var i,n;if(it(t)&&at(t.content)&&(t=t.content),t.hasChildNodes())for(tt(t),n=e?document.createDocumentFragment():document.createElement("div");i=t.firstChild;)n.appendChild(i);return n}function tt(t){for(var e;e=t.firstChild,et(e);)t.removeChild(e);for(;e=t.lastChild,et(e);)t.removeChild(e)}function et(t){return t&&(3===t.nodeType&&!t.data.trim()||8===t.nodeType)}function it(t){return t.tagName&&"template"===t.tagName.toLowerCase()}function nt(t,e){var i=An.debug?document.createComment(t):document.createTextNode(e?" ":"");return i.__v_anchor=!0,i}function rt(t){if(t.hasAttributes())for(var e=t.attributes,i=0,n=e.length;n>i;i++){var r=e[i].name;if(Nn.test(r))return l(r.replace(Nn,""))}}function st(t,e,i){for(var n;t!==e;)n=t.nextSibling,i(t),t=n;i(e)}function ot(t,e,i,n,r){function s(){if(a++,o&&a>=h.length){for(var t=0;t<h.length;t++)n.appendChild(h[t]);r&&r()}}var o=!1,a=0,h=[];st(t,e,function(t){t===e&&(o=!0),h.push(t),P(t,i,s)})}function at(t){return t&&11===t.nodeType}function ht(t){if(t.outerHTML)return t.outerHTML;var e=document.createElement("div");return e.appendChild(t.cloneNode(!0)),e.innerHTML}function lt(t,e){var i=t.tagName.toLowerCase(),n=t.hasAttributes();if(jn.test(i)||En.test(i)){if(n)return ct(t,e)}else{if(gt(e,"components",i))return{id:i};var r=n&&ct(t,e);if(r)return r}}function ct(t,e){var i=t.getAttribute("is");if(null!=i){if(gt(e,"components",i))return t.removeAttribute("is"),{id:i}}else if(i=M(t,"is"),null!=i)return{id:i,dynamic:!0}}function ut(e,n){var r,s,o;for(r in n)s=e[r],o=n[r],i(e,r)?m(s)&&m(o)&&ut(s,o):t(e,r,o);return e}function ft(t,e){var i=Object.create(t||null);return e?v(i,vt(e)):i}function pt(t){if(t.components)for(var e,i=t.components=vt(t.components),n=Object.keys(i),r=0,s=n.length;s>r;r++){var o=n[r];jn.test(o)||En.test(o)||(e=i[o],g(e)&&(i[o]=wi.extend(e)))}}function dt(t){var e,i,n=t.props;if(Di(n))for(t.props={},e=n.length;e--;)i=n[e],"string"==typeof i?t.props[i]=null:i.name&&(t.props[i.name]=i);else if(g(n)){var r=Object.keys(n);for(e=r.length;e--;)i=n[r[e]],"function"==typeof i&&(n[r[e]]={type:i})}}function vt(t){if(Di(t)){for(var e,i={},n=t.length;n--;){e=t[n];var r="function"==typeof e?e.options&&e.options.name||e.id:e.name||e.id;r&&(i[r]=e)}return i}return t}function mt(t,e,n){function r(i){var r=Sn[i]||Fn;o[i]=r(t[i],e[i],n,i)}pt(e),dt(e);var s,o={};if(e["extends"]&&(t="function"==typeof e["extends"]?mt(t,e["extends"].options,n):mt(t,e["extends"],n)),e.mixins)for(var a=0,h=e.mixins.length;h>a;a++){var l=e.mixins[a],c=l.prototype instanceof wi?l.options:l;t=mt(t,c,n)}for(s in t)r(s);for(s in e)i(t,s)||r(s);return o}function gt(t,e,i,n){if("string"==typeof i){var r,s=t[e],o=s[i]||s[r=l(i)]||s[r.charAt(0).toUpperCase()+r.slice(1)];return o}}function _t(){this.id=Dn++,this.subs=[]}function yt(t){Hn=!1,t(),Hn=!0}function bt(t){if(this.value=t,this.dep=new _t,_(t,"__ob__",this),Di(t)){var e=Pi?wt:Ct;e(t,Rn,Ln),this.observeArray(t)}else this.walk(t)}function wt(t,e){t.__proto__=e}function Ct(t,e,i){for(var n=0,r=i.length;r>n;n++){var s=i[n];_(t,s,e[s])}}function $t(t,e){if(t&&"object"==typeof t){var n;return i(t,"__ob__")&&t.__ob__ instanceof bt?n=t.__ob__:Hn&&(Di(t)||g(t))&&Object.isExtensible(t)&&!t._isVue&&(n=new bt(t)),n&&e&&n.addVm(e),n}}function kt(t,e,i){var n=new _t,r=Object.getOwnPropertyDescriptor(t,e);if(!r||r.configurable!==!1){var s=r&&r.get,o=r&&r.set,a=$t(i);Object.defineProperty(t,e,{enumerable:!0,configurable:!0,get:function(){var e=s?s.call(t):i;if(_t.target&&(n.depend(),a&&a.dep.depend(),Di(e)))for(var r,o=0,h=e.length;h>o;o++)r=e[o],r&&r.__ob__&&r.__ob__.dep.depend();return e},set:function(e){var r=s?s.call(t):i;e!==r&&(o?o.call(t,e):i=e,a=$t(e),n.notify())}})}}function xt(t){t.prototype._init=function(t){t=t||{},this.$el=null,this.$parent=t.parent,this.$root=this.$parent?this.$parent.$root:this,this.$children=[],this.$refs={},this.$els={},this._watchers=[],this._directives=[],this._uid=Mn++,this._isVue=!0,this._events={},this._eventsCount={},this._isFragment=!1,this._fragment=this._fragmentStart=this._fragmentEnd=null,this._isCompiled=this._isDestroyed=this._isReady=this._isAttached=this._isBeingDestroyed=this._vForRemoving=!1,this._unlinkFn=null,this._context=t._context||this.$parent,this._scope=t._scope,this._frag=t._frag,this._frag&&this._frag.children.push(this),this.$parent&&this.$parent.$children.push(this),t=this.$options=mt(this.constructor.options,t,this),this._updateRef(),this._data={},this._callHook("init"),this._initState(),this._initEvents(),this._callHook("created"),t.el&&this.$mount(t.el)}}function At(t){if(void 0===t)return"eof";var e=t.charCodeAt(0);switch(e){case 91:case 93:case 46:case 34:case 39:case 48:return t;case 95:case 36:return"ident";case 32:case 9:case 10:case 13:case 160:case 65279:case 8232:case 8233:return"ws"}return e>=97&&122>=e||e>=65&&90>=e?"ident":e>=49&&57>=e?"number":"else"}function Ot(t){var e=t.trim();return"0"===t.charAt(0)&&isNaN(t)?!1:n(e)?h(e):"*"+e}function Tt(t){function e(){var e=t[c+1];return u===Xn&&"'"===e||u===Yn&&'"'===e?(c++,n="\\"+e,p[Bn](),!0):void 0}var i,n,r,s,o,a,h,l=[],c=-1,u=Jn,f=0,p=[];for(p[Wn]=function(){void 0!==r&&(l.push(r),r=void 0)},p[Bn]=function(){void 0===r?r=n:r+=n},p[zn]=function(){p[Bn](),f++},p[Un]=function(){if(f>0)f--,u=Zn,p[Bn]();else{if(f=0,r=Ot(r),r===!1)return!1;p[Wn]()}};null!=u;)if(c++,i=t[c],"\\"!==i||!e()){if(s=At(i),h=er[u],o=h[s]||h["else"]||tr,o===tr)return;if(u=o[0],a=p[o[1]],a&&(n=o[2],n=void 0===n?i:n,a()===!1))return;if(u===Kn)return l.raw=t,l}}function Nt(t){var e=Vn.get(t);return e||(e=Tt(t),e&&Vn.put(t,e)),e}function jt(t,e){return It(e).get(t)}function Et(e,i,n){var r=e;if("string"==typeof i&&(i=Tt(i)),!i||!m(e))return!1;for(var s,o,a=0,h=i.length;h>a;a++)s=e,o=i[a],"*"===o.charAt(0)&&(o=It(o.slice(1)).get.call(r,r)),h-1>a?(e=e[o],m(e)||(e={},t(s,o,e))):Di(e)?e.$set(o,n):o in e?e[o]=n:t(e,o,n);return!0}function St(){}function Ft(t,e){var i=vr.length;return vr[i]=e?t.replace(lr,"\\n"):t,'"'+i+'"'}function Dt(t){var e=t.charAt(0),i=t.slice(1);return sr.test(i)?t:(i=i.indexOf('"')>-1?i.replace(ur,Pt):i,e+"scope."+i)}function Pt(t,e){return vr[e]}function Rt(t){ar.test(t),vr.length=0;var e=t.replace(cr,Ft).replace(hr,"");return e=(" "+e).replace(pr,Dt).replace(ur,Pt),Lt(e)}function Lt(t){try{return new Function("scope","return "+t+";")}catch(e){return St}}function Ht(t){var e=Nt(t);return e?function(t,i){Et(t,e,i)}:void 0}function It(t,e){t=t.trim();var i=nr.get(t);if(i)return e&&!i.set&&(i.set=Ht(i.exp)),i;var n={exp:t};return n.get=Mt(t)&&t.indexOf("[")<0?Lt("scope."+t):Rt(t),e&&(n.set=Ht(t)),nr.put(t,n),n}function Mt(t){return fr.test(t)&&!dr.test(t)&&"Math."!==t.slice(0,5)}function Vt(){gr.length=0,_r.length=0,yr={},br={},wr=!1}function Bt(){for(var t=!0;t;)t=!1,Wt(gr),Wt(_r),gr.length?t=!0:(Li&&An.devtools&&Li.emit("flush"),Vt())}function Wt(t){for(var e=0;e<t.length;e++){var i=t[e],n=i.id;yr[n]=null,i.run()}t.length=0}function zt(t){var e=t.id;if(null==yr[e]){var i=t.user?_r:gr;yr[e]=i.length,i.push(t),wr||(wr=!0,Yi(Bt))}}function Ut(t,e,i,n){n&&v(this,n);var r="function"==typeof e;if(this.vm=t,t._watchers.push(this),this.expression=e,this.cb=i,this.id=++Cr,this.active=!0,this.dirty=this.lazy,this.deps=[],this.newDeps=[],this.depIds=new Ki,this.newDepIds=new Ki,this.prevError=null,r)this.getter=e,this.setter=void 0;else{var s=It(e,this.twoWay);this.getter=s.get,this.setter=s.set}this.value=this.lazy?void 0:this.get(),this.queued=this.shallow=!1}function Jt(t,e){var i=void 0,n=void 0;e||(e=$r,e.clear());var r=Di(t),s=m(t);if((r||s)&&Object.isExtensible(t)){if(t.__ob__){var o=t.__ob__.dep.id;if(e.has(o))return;e.add(o)}if(r)for(i=t.length;i--;)Jt(t[i],e);else if(s)for(n=Object.keys(t),i=n.length;i--;)Jt(t[n[i]],e)}}function qt(t){return it(t)&&at(t.content)}function Qt(t,e){var i=e?t:t.trim(),n=xr.get(i);if(n)return n;var r=document.createDocumentFragment(),s=t.match(Tr),o=Nr.test(t),a=jr.test(t);if(s||o||a){var h=s&&s[1],l=Or[h]||Or.efault,c=l[0],u=l[1],f=l[2],p=document.createElement("div");for(p.innerHTML=u+t+f;c--;)p=p.lastChild;for(var d;d=p.firstChild;)r.appendChild(d)}else r.appendChild(document.createTextNode(t));return e||tt(r),xr.put(i,r),r}function Gt(t){if(qt(t))return Qt(t.innerHTML);if("SCRIPT"===t.tagName)return Qt(t.textContent);for(var e,i=Zt(t),n=document.createDocumentFragment();e=i.firstChild;)n.appendChild(e);return tt(n),n}function Zt(t){if(!t.querySelectorAll)return t.cloneNode();var e,i,n,r=t.cloneNode(!0);if(Er){var s=r;if(qt(t)&&(t=t.content,s=r.content),i=t.querySelectorAll("template"),i.length)for(n=s.querySelectorAll("template"),e=n.length;e--;)n[e].parentNode.replaceChild(Zt(i[e]),n[e])}if(Sr)if("TEXTAREA"===t.tagName)r.value=t.value;else if(i=t.querySelectorAll("textarea"),i.length)for(n=r.querySelectorAll("textarea"),e=n.length;e--;)n[e].value=i[e].value;return r}function Xt(t,e,i){var n,r;return at(t)?(tt(t),e?Zt(t):t):("string"==typeof t?i||"#"!==t.charAt(0)?r=Qt(t,i):(r=Ar.get(t),r||(n=document.getElementById(t.slice(1)),n&&(r=Gt(n),Ar.put(t,r)))):t.nodeType&&(r=Gt(t)),r&&e?Zt(r):r)}function Yt(t,e,i,n,r,s){this.children=[],this.childFrags=[],this.vm=e,this.scope=r,this.inserted=!1,this.parentFrag=s,s&&s.childFrags.push(this),this.unlink=t(e,i,n,r,this);var o=this.single=1===i.childNodes.length&&!i.childNodes[0].__v_anchor;o?(this.node=i.childNodes[0],this.before=Kt,this.remove=te):(this.node=nt("fragment-start"),this.end=nt("fragment-end"),this.frag=i,U(this.node,i),i.appendChild(this.end),this.before=ee,this.remove=ie),this.node.__v_frag=this}function Kt(t,e){this.inserted=!0;var i=e!==!1?D:B;i(this.node,t,this.vm),H(this.node)&&this.callHook(ne)}function te(){this.inserted=!1;var t=H(this.node),e=this;this.beforeRemove(),P(this.node,this.vm,function(){t&&e.callHook(re),e.destroy()})}function ee(t,e){this.inserted=!0;var i=this.vm,n=e!==!1?D:B;st(this.node,this.end,function(e){n(e,t,i)}),H(this.node)&&this.callHook(ne)}function ie(){this.inserted=!1;var t=this,e=H(this.node);this.beforeRemove(),ot(this.node,this.end,this.vm,this.frag,function(){e&&t.callHook(re),t.destroy()})}function ne(t){!t._isAttached&&H(t.$el)&&t._callHook("attached")}function re(t){t._isAttached&&!H(t.$el)&&t._callHook("detached")}function se(t,e){this.vm=t;var i,n="string"==typeof e;n||it(e)&&!e.hasAttribute("v-if")?i=Xt(e,!0):(i=document.createDocumentFragment(),i.appendChild(e)),this.template=i;var r,s=t.constructor.cid;if(s>0){var o=s+(n?e:ht(e));r=Pr.get(o),r||(r=De(i,t.$options,!0),Pr.put(o,r))}else r=De(i,t.$options,!0);this.linker=r}function oe(t,e,i){var n=t.node.previousSibling;if(n){for(t=n.__v_frag;!(t&&t.forId===i&&t.inserted||n===e);){if(n=n.previousSibling,!n)return;t=n.__v_frag}return t}}function ae(t){var e=t.node;if(t.end)for(;!e.__vue__&&e!==t.end&&e.nextSibling;)e=e.nextSibling;return e.__vue__}function he(t){for(var e=-1,i=new Array(Math.floor(t));++e<t;)i[e]=e;return i}function le(t,e,i,n){return n?"$index"===n?t:n.charAt(0).match(/\w/)?jt(i,n):i[n]:e||i}function ce(t,e,i){for(var n,r,s,o=e?[]:null,a=0,h=t.options.length;h>a;a++)if(n=t.options[a],s=i?n.hasAttribute("selected"):n.selected){if(r=n.hasOwnProperty("_value")?n._value:n.value,!e)return r;o.push(r)}return o}function ue(t,e){for(var i=t.length;i--;)if(C(t[i],e))return i;return-1}function fe(t,e){var i=e.map(function(t){var e=t.charCodeAt(0);return e>47&&58>e?parseInt(t,10):1===t.length&&(e=t.toUpperCase().charCodeAt(0),e>64&&91>e)?e:is[t]});return i=[].concat.apply([],i),function(e){return i.indexOf(e.keyCode)>-1?t.call(this,e):void 0}}function pe(t){return function(e){return e.stopPropagation(),t.call(this,e)}}function de(t){return function(e){return e.preventDefault(),t.call(this,e)}}function ve(t){return function(e){return e.target===e.currentTarget?t.call(this,e):void 0}}function me(t){if(as[t])return as[t];var e=ge(t);return as[t]=as[e]=e,e}function ge(t){t=u(t);var e=l(t),i=e.charAt(0).toUpperCase()+e.slice(1);hs||(hs=document.createElement("div"));var n,r=rs.length;if("filter"!==e&&e in hs.style)return{kebab:t,camel:e};for(;r--;)if(n=ss[r]+i,n in hs.style)return{kebab:rs[r]+t,camel:n}}function _e(t){var e=[];if(Di(t))for(var i=0,n=t.length;n>i;i++){var r=t[i];if(r)if("string"==typeof r)e.push(r);else for(var s in r)r[s]&&e.push(s)}else if(m(t))for(var o in t)t[o]&&e.push(o);return e}function ye(t,e,i){if(e=e.trim(),-1===e.indexOf(" "))return void i(t,e);for(var n=e.split(/\s+/),r=0,s=n.length;s>r;r++)i(t,n[r])}function be(t,e,i){function n(){++s>=r?i():t[s].call(e,n)}var r=t.length,s=0;t[0].call(e,n)}function we(t,e,i){for(var r,s,o,a,h,c,f,p=[],d=Object.keys(e),v=d.length;v--;)s=d[v],r=e[s]||ks,h=l(s),xs.test(h)&&(f={name:s,path:h,options:r,mode:$s.ONE_WAY,raw:null},o=u(s),null===(a=M(t,o))&&(null!==(a=M(t,o+".sync"))?f.mode=$s.TWO_WAY:null!==(a=M(t,o+".once"))&&(f.mode=$s.ONE_TIME)),null!==a?(f.raw=a,c=A(a),a=c.expression,f.filters=c.filters,n(a)&&!c.filters?f.optimizedLiteral=!0:f.dynamic=!0,f.parentPath=a):null!==(a=I(t,o))&&(f.raw=a),p.push(f));return Ce(p)}function Ce(t){return function(e,n){e._props={};for(var r,s,l,c,f,p=e.$options.propsData,d=t.length;d--;)if(r=t[d],f=r.raw,s=r.path,l=r.options,e._props[s]=r,p&&i(p,s)&&ke(e,r,p[s]),null===f)ke(e,r,void 0);else if(r.dynamic)r.mode===$s.ONE_TIME?(c=(n||e._context||e).$get(r.parentPath),ke(e,r,c)):e._context?e._bindDir({name:"prop",def:Os,prop:r},null,null,n):ke(e,r,e.$get(r.parentPath));else if(r.optimizedLiteral){var v=h(f);c=v===f?a(o(f)):v,ke(e,r,c)}else c=l.type!==Boolean||""!==f&&f!==u(r.name)?f:!0,ke(e,r,c)}}function $e(t,e,i,n){var r=e.dynamic&&Mt(e.parentPath),s=i;void 0===s&&(s=Ae(t,e)),s=Te(e,s,t);var o=s!==i;Oe(e,s,t)||(s=void 0),r&&!o?yt(function(){n(s)}):n(s)}function ke(t,e,i){$e(t,e,i,function(i){kt(t,e.path,i)})}function xe(t,e,i){$e(t,e,i,function(i){t[e.path]=i})}function Ae(t,e){var n=e.options;if(!i(n,"default"))return n.type===Boolean?!1:void 0;var r=n["default"];return m(r),"function"==typeof r&&n.type!==Function?r.call(t):r}function Oe(t,e,i){if(!t.options.required&&(null===t.raw||null==e))return!0;var n=t.options,r=n.type,s=!r,o=[];if(r){Di(r)||(r=[r]);for(var a=0;a<r.length&&!s;a++){var h=Ne(e,r[a]);o.push(h.expectedType),s=h.valid}}if(!s)return!1;var l=n.validator;return!l||l(e)}function Te(t,e,i){var n=t.options.coerce;return n&&"function"==typeof n?n(e):e}function Ne(t,e){var i,n;return e===String?(n="string",i=typeof t===n):e===Number?(n="number",i=typeof t===n):e===Boolean?(n="boolean",i=typeof t===n):e===Function?(n="function",i=typeof t===n):e===Object?(n="object",i=g(t)):e===Array?(n="array",i=Di(t)):i=t instanceof e,{valid:i,expectedType:n}}function je(t){Ts.push(t),Ns||(Ns=!0,Yi(Ee))}function Ee(){for(var t=document.documentElement.offsetHeight,e=0;e<Ts.length;e++)Ts[e]();return Ts=[],Ns=!1,t}function Se(t,e,i,n){this.id=e,this.el=t,this.enterClass=i&&i.enterClass||e+"-enter",this.leaveClass=i&&i.leaveClass||e+"-leave",this.hooks=i,this.vm=n,this.pendingCssEvent=this.pendingCssCb=this.cancel=this.pendingJsCb=this.op=this.cb=null,this.justEntered=!1,this.entered=this.left=!1,this.typeCache={},this.type=i&&i.type;var r=this;["enterNextTick","enterDone","leaveNextTick","leaveDone"].forEach(function(t){r[t]=p(r[t],r)})}function Fe(t){if(/svg$/.test(t.namespaceURI)){var e=t.getBoundingClientRect();return!(e.width||e.height)}return!(t.offsetWidth||t.offsetHeight||t.getClientRects().length)}function De(t,e,i){var n=i||!e._asComponent?Ve(t,e):null,r=n&&n.terminal||ri(t)||!t.hasChildNodes()?null:qe(t.childNodes,e);return function(t,e,i,s,o){var a=d(e.childNodes),h=Pe(function(){n&&n(t,e,i,s,o),r&&r(t,a,i,s,o)},t);return Le(t,h)}}function Pe(t,e){e._directives=[];var i=e._directives.length;t();var n=e._directives.slice(i);n.sort(Re);for(var r=0,s=n.length;s>r;r++)n[r]._bind();return n}function Re(t,e){return t=t.descriptor.def.priority||zs,e=e.descriptor.def.priority||zs,t>e?-1:t===e?0:1}function Le(t,e,i,n){function r(r){He(t,e,r),i&&n&&He(i,n)}return r.dirs=e,r}function He(t,e,i){for(var n=e.length;n--;)e[n]._teardown()}function Ie(t,e,i,n){var r=we(e,i,t),s=Pe(function(){r(t,n)},t);return Le(t,s)}function Me(t,e,i){var n,r,s=e._containerAttrs,o=e._replacerAttrs;return 11!==t.nodeType&&(e._asComponent?(s&&i&&(n=ti(s,i)),o&&(r=ti(o,e))):r=ti(t.attributes,e)),e._containerAttrs=e._replacerAttrs=null,function(t,e,i){var s,o=t._context;o&&n&&(s=Pe(function(){n(o,e,null,i)},o));var a=Pe(function(){r&&r(t,e)},t);return Le(t,a,o,s)}}function Ve(t,e){var i=t.nodeType;return 1!==i||ri(t)?3===i&&t.data.trim()?We(t,e):null:Be(t,e)}function Be(t,e){if("TEXTAREA"===t.tagName){var i=N(t.value);i&&(t.setAttribute(":value",j(i)),t.value="")}var n,r=t.hasAttributes(),s=r&&d(t.attributes);return r&&(n=Xe(t,s,e)),n||(n=Ge(t,e)),n||(n=Ze(t,e)),!n&&r&&(n=ti(s,e)),n}function We(t,e){if(t._skip)return ze;var i=N(t.wholeText);if(!i)return null;for(var n=t.nextSibling;n&&3===n.nodeType;)n._skip=!0,n=n.nextSibling;for(var r,s,o=document.createDocumentFragment(),a=0,h=i.length;h>a;a++)s=i[a],r=s.tag?Ue(s,e):document.createTextNode(s.value),o.appendChild(r);return Je(i,o,e)}function ze(t,e){z(e)}function Ue(t,e){function i(e){if(!t.descriptor){var i=A(t.value);t.descriptor={name:e,def:bs[e],expression:i.expression,filters:i.filters}}}var n;return t.oneTime?n=document.createTextNode(t.value):t.html?(n=document.createComment("v-html"),i("html")):(n=document.createTextNode(" "),i("text")),n}function Je(t,e){return function(i,n,r,o){for(var a,h,l,c=e.cloneNode(!0),u=d(c.childNodes),f=0,p=t.length;p>f;f++)a=t[f],h=a.value,a.tag&&(l=u[f],a.oneTime?(h=(o||i).$eval(h),a.html?J(l,Xt(h,!0)):l.data=s(h)):i._bindDir(a.descriptor,l,r,o));J(n,c)}}function qe(t,e){for(var i,n,r,s=[],o=0,a=t.length;a>o;o++)r=t[o],i=Ve(r,e),n=i&&i.terminal||"SCRIPT"===r.tagName||!r.hasChildNodes()?null:qe(r.childNodes,e),s.push(i,n);return s.length?Qe(s):null}function Qe(t){return function(e,i,n,r,s){for(var o,a,h,l=0,c=0,u=t.length;u>l;c++){o=i[c],a=t[l++],h=t[l++];var f=d(o.childNodes);a&&a(e,o,n,r,s),h&&h(e,f,n,r,s)}}}function Ge(t,e){var i=t.tagName.toLowerCase();if(!jn.test(i)){var n=gt(e,"elementDirectives",i);return n?Ke(t,i,"",e,n):void 0}}function Ze(t,e){var i=lt(t,e);if(i){var n=rt(t),r={name:"component",ref:n,expression:i.id,def:Hs.component,modifiers:{literal:!i.dynamic}},s=function(t,e,i,s,o){n&&kt((s||t).$refs,n,null),t._bindDir(r,e,i,s,o)};return s.terminal=!0,s}}function Xe(t,e,i){if(null!==I(t,"v-pre"))return Ye;if(t.hasAttribute("v-else")){var n=t.previousElementSibling;if(n&&n.hasAttribute("v-if"))return Ye}for(var r,s,o,a,h,l,c,u,f,p,d=0,v=e.length;v>d;d++)r=e[d],s=r.name.replace(Bs,""),(h=s.match(Vs))&&(f=gt(i,"directives",h[1]),f&&f.terminal&&(!p||(f.priority||Us)>p.priority)&&(p=f,c=r.name,a=ei(r.name),o=r.value,l=h[1],u=h[2]));return p?Ke(t,l,o,i,p,c,u,a):void 0}function Ye(){}function Ke(t,e,i,n,r,s,o,a){var h=A(i),l={name:e,arg:o,expression:h.expression,filters:h.filters,raw:i,attr:s,modifiers:a,def:r};"for"!==e&&"router-view"!==e||(l.ref=rt(t));var c=function(t,e,i,n,r){l.ref&&kt((n||t).$refs,l.ref,null),t._bindDir(l,e,i,n,r)};return c.terminal=!0,c}function ti(t,e){function i(t,e,i){var n=i&&ni(i),r=!n&&A(s);v.push({name:t,attr:o,raw:a,def:e,arg:l,modifiers:c,expression:r&&r.expression,filters:r&&r.filters,interp:i,hasOneTime:n})}for(var n,r,s,o,a,h,l,c,u,f,p,d=t.length,v=[];d--;)if(n=t[d],r=o=n.name,s=a=n.value,f=N(s),l=null,c=ei(r),r=r.replace(Bs,""),f)s=j(f),l=r,i("bind",bs.bind,f);else if(Ws.test(r))c.literal=!Is.test(r),i("transition",Hs.transition);else if(Ms.test(r))l=r.replace(Ms,""),i("on",bs.on);else if(Is.test(r))h=r.replace(Is,""),"style"===h||"class"===h?i(h,Hs[h]):(l=h,i("bind",bs.bind));else if(p=r.match(Vs)){if(h=p[1],l=p[2],"else"===h)continue;u=gt(e,"directives",h,!0),u&&i(h,u)}return v.length?ii(v):void 0}function ei(t){var e=Object.create(null),i=t.match(Bs);if(i)for(var n=i.length;n--;)e[i[n].slice(1)]=!0;return e}function ii(t){return function(e,i,n,r,s){for(var o=t.length;o--;)e._bindDir(t[o],i,n,r,s)}}function ni(t){for(var e=t.length;e--;)if(t[e].oneTime)return!0}function ri(t){return"SCRIPT"===t.tagName&&(!t.hasAttribute("type")||"text/javascript"===t.getAttribute("type"))}function si(t,e){return e&&(e._containerAttrs=ai(t)),it(t)&&(t=Xt(t)),e&&(e._asComponent&&!e.template&&(e.template="<slot></slot>"),e.template&&(e._content=K(t),t=oi(t,e))),at(t)&&(U(nt("v-start",!0),t),t.appendChild(nt("v-end",!0))),t}function oi(t,e){var i=e.template,n=Xt(i,!0);if(n){var r=n.firstChild,s=r.tagName&&r.tagName.toLowerCase();return e.replace?(t===document.body,n.childNodes.length>1||1!==r.nodeType||"component"===s||gt(e,"components",s)||V(r,"is")||gt(e,"elementDirectives",s)||r.hasAttribute("v-for")||r.hasAttribute("v-if")?n:(e._replacerAttrs=ai(r),hi(t,r),r)):(t.appendChild(n),t)}}function ai(t){return 1===t.nodeType&&t.hasAttributes()?d(t.attributes):void 0}function hi(t,e){for(var i,n,r=t.attributes,s=r.length;s--;)i=r[s].name,n=r[s].value,e.hasAttribute(i)||Js.test(i)?"class"===i&&!N(n)&&(n=n.trim())&&n.split(/\s+/).forEach(function(t){X(e,t)}):e.setAttribute(i,n)}function li(t,e){if(e){for(var i,n,r=t._slotContents=Object.create(null),s=0,o=e.children.length;o>s;s++)i=e.children[s],(n=i.getAttribute("slot"))&&(r[n]||(r[n]=[])).push(i);for(n in r)r[n]=ci(r[n],e);if(e.hasChildNodes()){var a=e.childNodes;if(1===a.length&&3===a[0].nodeType&&!a[0].data.trim())return;r["default"]=ci(e.childNodes,e)}}}function ci(t,e){var i=document.createDocumentFragment();t=d(t);for(var n=0,r=t.length;r>n;n++){var s=t[n];!it(s)||s.hasAttribute("v-if")||s.hasAttribute("v-for")||(e.removeChild(s),s=Xt(s,!0)),i.appendChild(s)}return i}function ui(t){function e(){}function n(t,e){var i=new Ut(e,t,null,{lazy:!0});return function(){return i.dirty&&i.evaluate(),_t.target&&i.depend(),i.value}}Object.defineProperty(t.prototype,"$data",{get:function(){return this._data},set:function(t){t!==this._data&&this._setData(t)}}),t.prototype._initState=function(){this._initProps(),this._initMeta(),this._initMethods(),this._initData(),this._initComputed()},t.prototype._initProps=function(){var t=this.$options,e=t.el,i=t.props;e=t.el=L(e),this._propsUnlinkFn=e&&1===e.nodeType&&i?Ie(this,e,i,this._scope):null},t.prototype._initData=function(){var t=this.$options.data,e=this._data=t?t():{};g(e)||(e={});var n,r,s=this._props,o=Object.keys(e);for(n=o.length;n--;)r=o[n],s&&i(s,r)||this._proxy(r);$t(e,this)},t.prototype._setData=function(t){t=t||{};var e=this._data;this._data=t;var n,r,s;for(n=Object.keys(e),s=n.length;s--;)r=n[s],r in t||this._unproxy(r);for(n=Object.keys(t),s=n.length;s--;)r=n[s],i(this,r)||this._proxy(r);e.__ob__.removeVm(this),$t(t,this),this._digest()},t.prototype._proxy=function(t){if(!r(t)){var e=this;Object.defineProperty(e,t,{configurable:!0,enumerable:!0,get:function(){return e._data[t]},set:function(i){e._data[t]=i}})}},t.prototype._unproxy=function(t){r(t)||delete this[t]},t.prototype._digest=function(){for(var t=0,e=this._watchers.length;e>t;t++)this._watchers[t].update(!0)},t.prototype._initComputed=function(){var t=this.$options.computed;if(t)for(var i in t){var r=t[i],s={enumerable:!0,configurable:!0};"function"==typeof r?(s.get=n(r,this),s.set=e):(s.get=r.get?r.cache!==!1?n(r.get,this):p(r.get,this):e,s.set=r.set?p(r.set,this):e),Object.defineProperty(this,i,s)}},t.prototype._initMethods=function(){var t=this.$options.methods;if(t)for(var e in t)this[e]=p(t[e],this)},t.prototype._initMeta=function(){var t=this.$options._meta;if(t)for(var e in t)kt(this,e,t[e])}}function fi(t){function e(t,e){for(var i,n,r,s=e.attributes,o=0,a=s.length;a>o;o++)i=s[o].name,Qs.test(i)&&(i=i.replace(Qs,""),n=s[o].value,Mt(n)&&(n+=".apply(this, $arguments)"),r=(t._scope||t._context).$eval(n,!0),r._fromParent=!0,t.$on(i.replace(Qs),r))}function i(t,e,i){if(i){var r,s,o,a;for(s in i)if(r=i[s],Di(r))for(o=0,a=r.length;a>o;o++)n(t,e,s,r[o]);else n(t,e,s,r)}}function n(t,e,i,r,s){var o=typeof r;if("function"===o)t[e](i,r,s);else if("string"===o){var a=t.$options.methods,h=a&&a[r];h&&t[e](i,h,s)}else r&&"object"===o&&n(t,e,i,r.handler,r)}function r(){this._isAttached||(this._isAttached=!0,this.$children.forEach(s))}function s(t){!t._isAttached&&H(t.$el)&&t._callHook("attached")}function o(){this._isAttached&&(this._isAttached=!1,this.$children.forEach(a))}function a(t){t._isAttached&&!H(t.$el)&&t._callHook("detached")}t.prototype._initEvents=function(){var t=this.$options;t._asComponent&&e(this,t.el),i(this,"$on",t.events),i(this,"$watch",t.watch)},t.prototype._initDOMHooks=function(){this.$on("hook:attached",r),this.$on("hook:detached",o)},t.prototype._callHook=function(t){this.$emit("pre-hook:"+t);var e=this.$options[t];if(e)for(var i=0,n=e.length;n>i;i++)e[i].call(this);this.$emit("hook:"+t)}}function pi(){}function di(t,e,i,n,r,s){this.vm=e,this.el=i,this.descriptor=t,this.name=t.name,this.expression=t.expression,this.arg=t.arg,this.modifiers=t.modifiers,this.filters=t.filters,this.literal=this.modifiers&&this.modifiers.literal,this._locked=!1,this._bound=!1,this._listeners=null,this._host=n,this._scope=r,this._frag=s}function vi(t){t.prototype._updateRef=function(t){var e=this.$options._ref;if(e){var i=(this._scope||this._context).$refs;t?i[e]===this&&(i[e]=null):i[e]=this}},t.prototype._compile=function(t){var e=this.$options,i=t;if(t=si(t,e),this._initElement(t),1!==t.nodeType||null===I(t,"v-pre")){var n=this._context&&this._context.$options,r=Me(t,e,n);li(this,e._content);var s,o=this.constructor;e._linkerCachable&&(s=o.linker,s||(s=o.linker=De(t,e)));var a=r(this,t,this._scope),h=s?s(this,t):De(t,e)(this,t);this._unlinkFn=function(){a(),h(!0)},e.replace&&J(i,t),this._isCompiled=!0,this._callHook("compiled")}},t.prototype._initElement=function(t){at(t)?(this._isFragment=!0,this.$el=this._fragmentStart=t.firstChild,this._fragmentEnd=t.lastChild,3===this._fragmentStart.nodeType&&(this._fragmentStart.data=this._fragmentEnd.data=""),this._fragment=t):this.$el=t,this.$el.__vue__=this,this._callHook("beforeCompile")},t.prototype._bindDir=function(t,e,i,n,r){this._directives.push(new di(t,this,e,i,n,r))},t.prototype._destroy=function(t,e){if(this._isBeingDestroyed)return void(e||this._cleanup());var i,n,r=this,s=function(){!i||n||e||r._cleanup()};t&&this.$el&&(n=!0,this.$remove(function(){
n=!1,s()})),this._callHook("beforeDestroy"),this._isBeingDestroyed=!0;var o,a=this.$parent;for(a&&!a._isBeingDestroyed&&(a.$children.$remove(this),this._updateRef(!0)),o=this.$children.length;o--;)this.$children[o].$destroy();for(this._propsUnlinkFn&&this._propsUnlinkFn(),this._unlinkFn&&this._unlinkFn(),o=this._watchers.length;o--;)this._watchers[o].teardown();this.$el&&(this.$el.__vue__=null),i=!0,s()},t.prototype._cleanup=function(){this._isDestroyed||(this._frag&&this._frag.children.$remove(this),this._data&&this._data.__ob__&&this._data.__ob__.removeVm(this),this.$el=this.$parent=this.$root=this.$children=this._watchers=this._context=this._scope=this._directives=null,this._isDestroyed=!0,this._callHook("destroyed"),this.$off())}}function mi(t){t.prototype._applyFilters=function(t,e,i,n){var r,s,o,a,h,l,c,u,f;for(l=0,c=i.length;c>l;l++)if(r=i[n?c-l-1:l],s=gt(this.$options,"filters",r.name,!0),s&&(s=n?s.write:s.read||s,"function"==typeof s)){if(o=n?[t,e]:[t],h=n?2:1,r.args)for(u=0,f=r.args.length;f>u;u++)a=r.args[u],o[u+h]=a.dynamic?this.$get(a.value):a.value;t=s.apply(this,o)}return t},t.prototype._resolveComponent=function(e,i){var n;if(n="function"==typeof e?e:gt(this.$options,"components",e,!0))if(n.options)i(n);else if(n.resolved)i(n.resolved);else if(n.requested)n.pendingCallbacks.push(i);else{n.requested=!0;var r=n.pendingCallbacks=[i];n.call(this,function(e){g(e)&&(e=t.extend(e)),n.resolved=e;for(var i=0,s=r.length;s>i;i++)r[i](e)},function(t){})}}}function gi(t){function i(t){return JSON.parse(JSON.stringify(t))}t.prototype.$get=function(t,e){var i=It(t);if(i){if(e){var n=this;return function(){n.$arguments=d(arguments);var t=i.get.call(n,n);return n.$arguments=null,t}}try{return i.get.call(this,this)}catch(r){}}},t.prototype.$set=function(t,e){var i=It(t,!0);i&&i.set&&i.set.call(this,this,e)},t.prototype.$delete=function(t){e(this._data,t)},t.prototype.$watch=function(t,e,i){var n,r=this;"string"==typeof t&&(n=A(t),t=n.expression);var s=new Ut(r,t,e,{deep:i&&i.deep,sync:i&&i.sync,filters:n&&n.filters,user:!i||i.user!==!1});return i&&i.immediate&&e.call(r,s.value),function(){s.teardown()}},t.prototype.$eval=function(t,e){if(Gs.test(t)){var i=A(t),n=this.$get(i.expression,e);return i.filters?this._applyFilters(n,null,i.filters):n}return this.$get(t,e)},t.prototype.$interpolate=function(t){var e=N(t),i=this;return e?1===e.length?i.$eval(e[0].value)+"":e.map(function(t){return t.tag?i.$eval(t.value):t.value}).join(""):t},t.prototype.$log=function(t){var e=t?jt(this._data,t):this._data;if(e&&(e=i(e)),!t){var n;for(n in this.$options.computed)e[n]=i(this[n]);if(this._props)for(n in this._props)e[n]=i(this[n])}console.log(e)}}function _i(t){function e(t,e,n,r,s,o){e=i(e);var a=!H(e),h=r===!1||a?s:o,l=!a&&!t._isAttached&&!H(t.$el);return t._isFragment?(st(t._fragmentStart,t._fragmentEnd,function(i){h(i,e,t)}),n&&n()):h(t.$el,e,t,n),l&&t._callHook("attached"),t}function i(t){return"string"==typeof t?document.querySelector(t):t}function n(t,e,i,n){e.appendChild(t),n&&n()}function r(t,e,i,n){B(t,e),n&&n()}function s(t,e,i){z(t),i&&i()}t.prototype.$nextTick=function(t){Yi(t,this)},t.prototype.$appendTo=function(t,i,r){return e(this,t,i,r,n,F)},t.prototype.$prependTo=function(t,e,n){return t=i(t),t.hasChildNodes()?this.$before(t.firstChild,e,n):this.$appendTo(t,e,n),this},t.prototype.$before=function(t,i,n){return e(this,t,i,n,r,D)},t.prototype.$after=function(t,e,n){return t=i(t),t.nextSibling?this.$before(t.nextSibling,e,n):this.$appendTo(t.parentNode,e,n),this},t.prototype.$remove=function(t,e){if(!this.$el.parentNode)return t&&t();var i=this._isAttached&&H(this.$el);i||(e=!1);var n=this,r=function(){i&&n._callHook("detached"),t&&t()};if(this._isFragment)ot(this._fragmentStart,this._fragmentEnd,this,this._fragment,r);else{var o=e===!1?s:P;o(this.$el,this,r)}return this}}function yi(t){function e(t,e,n){var r=t.$parent;if(r&&n&&!i.test(e))for(;r;)r._eventsCount[e]=(r._eventsCount[e]||0)+n,r=r.$parent}t.prototype.$on=function(t,i){return(this._events[t]||(this._events[t]=[])).push(i),e(this,t,1),this},t.prototype.$once=function(t,e){function i(){n.$off(t,i),e.apply(this,arguments)}var n=this;return i.fn=e,this.$on(t,i),this},t.prototype.$off=function(t,i){var n;if(!arguments.length){if(this.$parent)for(t in this._events)n=this._events[t],n&&e(this,t,-n.length);return this._events={},this}if(n=this._events[t],!n)return this;if(1===arguments.length)return e(this,t,-n.length),this._events[t]=null,this;for(var r,s=n.length;s--;)if(r=n[s],r===i||r.fn===i){e(this,t,-1),n.splice(s,1);break}return this},t.prototype.$emit=function(t){var e="string"==typeof t;t=e?t:t.name;var i=this._events[t],n=e||!i;if(i){i=i.length>1?d(i):i;var r=e&&i.some(function(t){return t._fromParent});r&&(n=!1);for(var s=d(arguments,1),o=0,a=i.length;a>o;o++){var h=i[o],l=h.apply(this,s);l!==!0||r&&!h._fromParent||(n=!0)}}return n},t.prototype.$broadcast=function(t){var e="string"==typeof t;if(t=e?t:t.name,this._eventsCount[t]){var i=this.$children,n=d(arguments);e&&(n[0]={name:t,source:this});for(var r=0,s=i.length;s>r;r++){var o=i[r],a=o.$emit.apply(o,n);a&&o.$broadcast.apply(o,n)}return this}},t.prototype.$dispatch=function(t){var e=this.$emit.apply(this,arguments);if(e){var i=this.$parent,n=d(arguments);for(n[0]={name:t,source:this};i;)e=i.$emit.apply(i,n),i=e?i.$parent:null;return this}};var i=/^hook:/}function bi(t){function e(){this._isAttached=!0,this._isReady=!0,this._callHook("ready")}t.prototype.$mount=function(t){return this._isCompiled?void 0:(t=L(t),t||(t=document.createElement("div")),this._compile(t),this._initDOMHooks(),H(this.$el)?(this._callHook("attached"),e.call(this)):this.$once("hook:attached",e),this)},t.prototype.$destroy=function(t,e){this._destroy(t,e)},t.prototype.$compile=function(t,e,i,n){return De(t,this.$options,!0)(this,t,e,i,n)}}function wi(t){this._init(t)}function Ci(t,e,i){return i=i?parseInt(i,10):0,e=o(e),"number"==typeof e?t.slice(i,i+e):t}function $i(t,e,i){if(t=Ks(t),null==e)return t;if("function"==typeof e)return t.filter(e);e=(""+e).toLowerCase();for(var n,r,s,o,a="in"===i?3:2,h=Array.prototype.concat.apply([],d(arguments,a)),l=[],c=0,u=t.length;u>c;c++)if(n=t[c],s=n&&n.$value||n,o=h.length){for(;o--;)if(r=h[o],"$key"===r&&xi(n.$key,e)||xi(jt(s,r),e)){l.push(n);break}}else xi(n,e)&&l.push(n);return l}function ki(t){function e(t,e,i){var r=n[i];return r&&("$key"!==r&&(m(t)&&"$value"in t&&(t=t.$value),m(e)&&"$value"in e&&(e=e.$value)),t=m(t)?jt(t,r):t,e=m(e)?jt(e,r):e),t===e?0:t>e?s:-s}var i=null,n=void 0;t=Ks(t);var r=d(arguments,1),s=r[r.length-1];"number"==typeof s?(s=0>s?-1:1,r=r.length>1?r.slice(0,-1):r):s=1;var o=r[0];return o?("function"==typeof o?i=function(t,e){return o(t,e)*s}:(n=Array.prototype.concat.apply([],r),i=function(t,r,s){return s=s||0,s>=n.length-1?e(t,r,s):e(t,r,s)||i(t,r,s+1)}),t.slice().sort(i)):t}function xi(t,e){var i;if(g(t)){var n=Object.keys(t);for(i=n.length;i--;)if(xi(t[n[i]],e))return!0}else if(Di(t)){for(i=t.length;i--;)if(xi(t[i],e))return!0}else if(null!=t)return t.toString().toLowerCase().indexOf(e)>-1}function Ai(i){function n(t){return new Function("return function "+f(t)+" (options) { this._init(options) }")()}i.options={directives:bs,elementDirectives:Ys,filters:eo,transitions:{},components:{},partials:{},replace:!0},i.util=In,i.config=An,i.set=t,i["delete"]=e,i.nextTick=Yi,i.compiler=qs,i.FragmentFactory=se,i.internalDirectives=Hs,i.parsers={path:ir,text:$n,template:Fr,directive:gn,expression:mr},i.cid=0;var r=1;i.extend=function(t){t=t||{};var e=this,i=0===e.cid;if(i&&t._Ctor)return t._Ctor;var s=t.name||e.options.name,o=n(s||"VueComponent");return o.prototype=Object.create(e.prototype),o.prototype.constructor=o,o.cid=r++,o.options=mt(e.options,t),o["super"]=e,o.extend=e.extend,An._assetTypes.forEach(function(t){o[t]=e[t]}),s&&(o.options.components[s]=o),i&&(t._Ctor=o),o},i.use=function(t){if(!t.installed){var e=d(arguments,1);return e.unshift(this),"function"==typeof t.install?t.install.apply(t,e):t.apply(null,e),t.installed=!0,this}},i.mixin=function(t){i.options=mt(i.options,t)},An._assetTypes.forEach(function(t){i[t]=function(e,n){return n?("component"===t&&g(n)&&(n.name||(n.name=e),n=i.extend(n)),this.options[t+"s"][e]=n,n):this.options[t+"s"][e]}}),v(i.transition,Tn)}var Oi=Object.prototype.hasOwnProperty,Ti=/^\s?(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/,Ni=/-(\w)/g,ji=/([a-z\d])([A-Z])/g,Ei=/(?:^|[-_\/])(\w)/g,Si=Object.prototype.toString,Fi="[object Object]",Di=Array.isArray,Pi="__proto__"in{},Ri="undefined"!=typeof window&&"[object Object]"!==Object.prototype.toString.call(window),Li=Ri&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__,Hi=Ri&&window.navigator.userAgent.toLowerCase(),Ii=Hi&&Hi.indexOf("trident")>0,Mi=Hi&&Hi.indexOf("msie 9.0")>0,Vi=Hi&&Hi.indexOf("android")>0,Bi=Hi&&/(iphone|ipad|ipod|ios)/i.test(Hi),Wi=Bi&&Hi.match(/os ([\d_]+)/),zi=Wi&&Wi[1].split("_"),Ui=zi&&Number(zi[0])>=9&&Number(zi[1])>=3&&!window.indexedDB,Ji=void 0,qi=void 0,Qi=void 0,Gi=void 0;if(Ri&&!Mi){var Zi=void 0===window.ontransitionend&&void 0!==window.onwebkittransitionend,Xi=void 0===window.onanimationend&&void 0!==window.onwebkitanimationend;Ji=Zi?"WebkitTransition":"transition",qi=Zi?"webkitTransitionEnd":"transitionend",Qi=Xi?"WebkitAnimation":"animation",Gi=Xi?"webkitAnimationEnd":"animationend"}var Yi=function(){function t(){n=!1;var t=i.slice(0);i=[];for(var e=0;e<t.length;e++)t[e]()}var e,i=[],n=!1;if("undefined"==typeof MutationObserver||Ui){var r=Ri?window:"undefined"!=typeof global?global:{};e=r.setImmediate||setTimeout}else{var s=1,o=new MutationObserver(t),a=document.createTextNode(s);o.observe(a,{characterData:!0}),e=function(){s=(s+1)%2,a.data=s}}return function(r,s){var o=s?function(){r.call(s)}:r;i.push(o),n||(n=!0,e(t,0))}}(),Ki=void 0;"undefined"!=typeof Set&&Set.toString().match(/native code/)?Ki=Set:(Ki=function(){this.set=Object.create(null)},Ki.prototype.has=function(t){return void 0!==this.set[t]},Ki.prototype.add=function(t){this.set[t]=1},Ki.prototype.clear=function(){this.set=Object.create(null)});var tn=$.prototype;tn.put=function(t,e){var i,n=this.get(t,!0);return n||(this.size===this.limit&&(i=this.shift()),n={key:t},this._keymap[t]=n,this.tail?(this.tail.newer=n,n.older=this.tail):this.head=n,this.tail=n,this.size++),n.value=e,i},tn.shift=function(){var t=this.head;return t&&(this.head=this.head.newer,this.head.older=void 0,t.newer=t.older=void 0,this._keymap[t.key]=void 0,this.size--),t},tn.get=function(t,e){var i=this._keymap[t];if(void 0!==i)return i===this.tail?e?i:i.value:(i.newer&&(i===this.head&&(this.head=i.newer),i.newer.older=i.older),i.older&&(i.older.newer=i.newer),i.newer=void 0,i.older=this.tail,this.tail&&(this.tail.newer=i),this.tail=i,e?i:i.value)};var en,nn,rn,sn,on,an,hn,ln,cn,un,fn,pn,dn=new $(1e3),vn=/[^\s'"]+|'[^']*'|"[^"]*"/g,mn=/^in$|^-?\d+/,gn=Object.freeze({parseDirective:A}),_n=/[-.*+?^${}()|[\]\/\\]/g,yn=void 0,bn=void 0,wn=void 0,Cn=/[^|]\|[^|]/,$n=Object.freeze({compileRegex:T,parseText:N,tokensToExp:j}),kn=["{{","}}"],xn=["{{{","}}}"],An=Object.defineProperties({debug:!1,silent:!1,async:!0,warnExpressionErrors:!0,devtools:!1,_delimitersChanged:!0,_assetTypes:["component","directive","elementDirective","filter","transition","partial"],_propBindingModes:{ONE_WAY:0,TWO_WAY:1,ONE_TIME:2},_maxUpdateCount:100},{delimiters:{get:function(){return kn},set:function(t){kn=t,T()},configurable:!0,enumerable:!0},unsafeDelimiters:{get:function(){return xn},set:function(t){xn=t,T()},configurable:!0,enumerable:!0}}),On=void 0,Tn=Object.freeze({appendWithTransition:F,beforeWithTransition:D,removeWithTransition:P,applyTransition:R}),Nn=/^v-ref:/,jn=/^(div|p|span|img|a|b|i|br|ul|ol|li|h1|h2|h3|h4|h5|h6|code|pre|table|th|td|tr|form|label|input|select|option|nav|article|section|header|footer)$/i,En=/^(slot|partial|component)$/i,Sn=An.optionMergeStrategies=Object.create(null);Sn.data=function(t,e,i){return i?t||e?function(){var n="function"==typeof e?e.call(i):e,r="function"==typeof t?t.call(i):void 0;return n?ut(n,r):r}:void 0:e?"function"!=typeof e?t:t?function(){return ut(e.call(this),t.call(this))}:e:t},Sn.el=function(t,e,i){if(i||!e||"function"==typeof e){var n=e||t;return i&&"function"==typeof n?n.call(i):n}},Sn.init=Sn.created=Sn.ready=Sn.attached=Sn.detached=Sn.beforeCompile=Sn.compiled=Sn.beforeDestroy=Sn.destroyed=Sn.activate=function(t,e){return e?t?t.concat(e):Di(e)?e:[e]:t},An._assetTypes.forEach(function(t){Sn[t+"s"]=ft}),Sn.watch=Sn.events=function(t,e){if(!e)return t;if(!t)return e;var i={};v(i,t);for(var n in e){var r=i[n],s=e[n];r&&!Di(r)&&(r=[r]),i[n]=r?r.concat(s):[s]}return i},Sn.props=Sn.methods=Sn.computed=function(t,e){if(!e)return t;if(!t)return e;var i=Object.create(null);return v(i,t),v(i,e),i};var Fn=function(t,e){return void 0===e?t:e},Dn=0;_t.target=null,_t.prototype.addSub=function(t){this.subs.push(t)},_t.prototype.removeSub=function(t){this.subs.$remove(t)},_t.prototype.depend=function(){_t.target.addDep(this)},_t.prototype.notify=function(){for(var t=d(this.subs),e=0,i=t.length;i>e;e++)t[e].update()};var Pn=Array.prototype,Rn=Object.create(Pn);["push","pop","shift","unshift","splice","sort","reverse"].forEach(function(t){var e=Pn[t];_(Rn,t,function(){for(var i=arguments.length,n=new Array(i);i--;)n[i]=arguments[i];var r,s=e.apply(this,n),o=this.__ob__;switch(t){case"push":r=n;break;case"unshift":r=n;break;case"splice":r=n.slice(2)}return r&&o.observeArray(r),o.dep.notify(),s})}),_(Pn,"$set",function(t,e){return t>=this.length&&(this.length=Number(t)+1),this.splice(t,1,e)[0]}),_(Pn,"$remove",function(t){if(this.length){var e=b(this,t);return e>-1?this.splice(e,1):void 0}});var Ln=Object.getOwnPropertyNames(Rn),Hn=!0;bt.prototype.walk=function(t){for(var e=Object.keys(t),i=0,n=e.length;n>i;i++)this.convert(e[i],t[e[i]])},bt.prototype.observeArray=function(t){for(var e=0,i=t.length;i>e;e++)$t(t[e])},bt.prototype.convert=function(t,e){kt(this.value,t,e)},bt.prototype.addVm=function(t){(this.vms||(this.vms=[])).push(t)},bt.prototype.removeVm=function(t){this.vms.$remove(t)};var In=Object.freeze({defineReactive:kt,set:t,del:e,hasOwn:i,isLiteral:n,isReserved:r,_toString:s,toNumber:o,toBoolean:a,stripQuotes:h,camelize:l,hyphenate:u,classify:f,bind:p,toArray:d,extend:v,isObject:m,isPlainObject:g,def:_,debounce:y,indexOf:b,cancellable:w,looseEqual:C,isArray:Di,hasProto:Pi,inBrowser:Ri,devtools:Li,isIE:Ii,isIE9:Mi,isAndroid:Vi,isIos:Bi,iosVersionMatch:Wi,iosVersion:zi,hasMutationObserverBug:Ui,get transitionProp(){return Ji},get transitionEndEvent(){return qi},get animationProp(){return Qi},get animationEndEvent(){return Gi},nextTick:Yi,get _Set(){return Ki},query:L,inDoc:H,getAttr:I,getBindAttr:M,hasBindAttr:V,before:B,after:W,remove:z,prepend:U,replace:J,on:q,off:Q,setClass:Z,addClass:X,removeClass:Y,extractContent:K,trimNode:tt,isTemplate:it,createAnchor:nt,findRef:rt,mapNodeRange:st,removeNodeRange:ot,isFragment:at,getOuterHTML:ht,mergeOptions:mt,resolveAsset:gt,checkComponentAttr:lt,commonTagRE:jn,reservedTagRE:En,warn:On}),Mn=0,Vn=new $(1e3),Bn=0,Wn=1,zn=2,Un=3,Jn=0,qn=1,Qn=2,Gn=3,Zn=4,Xn=5,Yn=6,Kn=7,tr=8,er=[];er[Jn]={ws:[Jn],ident:[Gn,Bn],"[":[Zn],eof:[Kn]},er[qn]={ws:[qn],".":[Qn],"[":[Zn],eof:[Kn]},er[Qn]={ws:[Qn],ident:[Gn,Bn]},er[Gn]={ident:[Gn,Bn],0:[Gn,Bn],number:[Gn,Bn],ws:[qn,Wn],".":[Qn,Wn],"[":[Zn,Wn],eof:[Kn,Wn]},er[Zn]={"'":[Xn,Bn],'"':[Yn,Bn],"[":[Zn,zn],"]":[qn,Un],eof:tr,"else":[Zn,Bn]},er[Xn]={"'":[Zn,Bn],eof:tr,"else":[Xn,Bn]},er[Yn]={'"':[Zn,Bn],eof:tr,"else":[Yn,Bn]};var ir=Object.freeze({parsePath:Nt,getPath:jt,setPath:Et}),nr=new $(1e3),rr="Math,Date,this,true,false,null,undefined,Infinity,NaN,isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,parseInt,parseFloat",sr=new RegExp("^("+rr.replace(/,/g,"\\b|")+"\\b)"),or="break,case,class,catch,const,continue,debugger,default,delete,do,else,export,extends,finally,for,function,if,import,in,instanceof,let,return,super,switch,throw,try,var,while,with,yield,enum,await,implements,package,protected,static,interface,private,public",ar=new RegExp("^("+or.replace(/,/g,"\\b|")+"\\b)"),hr=/\s/g,lr=/\n/g,cr=/[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g,ur=/"(\d+)"/g,fr=/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/,pr=/[^\w$\.](?:[A-Za-z_$][\w$]*)/g,dr=/^(?:true|false|null|undefined|Infinity|NaN)$/,vr=[],mr=Object.freeze({parseExpression:It,isSimplePath:Mt}),gr=[],_r=[],yr={},br={},wr=!1,Cr=0;Ut.prototype.get=function(){this.beforeGet();var t,e=this.scope||this.vm;try{t=this.getter.call(e,e)}catch(i){}return this.deep&&Jt(t),this.preProcess&&(t=this.preProcess(t)),this.filters&&(t=e._applyFilters(t,null,this.filters,!1)),this.postProcess&&(t=this.postProcess(t)),this.afterGet(),t},Ut.prototype.set=function(t){var e=this.scope||this.vm;this.filters&&(t=e._applyFilters(t,this.value,this.filters,!0));try{this.setter.call(e,e,t)}catch(i){}var n=e.$forContext;if(n&&n.alias===this.expression){if(n.filters)return;n._withLock(function(){e.$key?n.rawValue[e.$key]=t:n.rawValue.$set(e.$index,t)})}},Ut.prototype.beforeGet=function(){_t.target=this},Ut.prototype.addDep=function(t){var e=t.id;this.newDepIds.has(e)||(this.newDepIds.add(e),this.newDeps.push(t),this.depIds.has(e)||t.addSub(this))},Ut.prototype.afterGet=function(){_t.target=null;for(var t=this.deps.length;t--;){var e=this.deps[t];this.newDepIds.has(e.id)||e.removeSub(this)}var i=this.depIds;this.depIds=this.newDepIds,this.newDepIds=i,this.newDepIds.clear(),i=this.deps,this.deps=this.newDeps,this.newDeps=i,this.newDeps.length=0},Ut.prototype.update=function(t){this.lazy?this.dirty=!0:this.sync||!An.async?this.run():(this.shallow=this.queued?t?this.shallow:!1:!!t,this.queued=!0,zt(this))},Ut.prototype.run=function(){if(this.active){var t=this.get();if(t!==this.value||(m(t)||this.deep)&&!this.shallow){var e=this.value;this.value=t;this.prevError;this.cb.call(this.vm,t,e)}this.queued=this.shallow=!1}},Ut.prototype.evaluate=function(){var t=_t.target;this.value=this.get(),this.dirty=!1,_t.target=t},Ut.prototype.depend=function(){for(var t=this.deps.length;t--;)this.deps[t].depend()},Ut.prototype.teardown=function(){if(this.active){this.vm._isBeingDestroyed||this.vm._vForRemoving||this.vm._watchers.$remove(this);for(var t=this.deps.length;t--;)this.deps[t].removeSub(this);this.active=!1,this.vm=this.cb=this.value=null}};var $r=new Ki,kr={bind:function(){this.attr=3===this.el.nodeType?"data":"textContent"},update:function(t){this.el[this.attr]=s(t)}},xr=new $(1e3),Ar=new $(1e3),Or={efault:[0,"",""],legend:[1,"<fieldset>","</fieldset>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"]};Or.td=Or.th=[3,"<table><tbody><tr>","</tr></tbody></table>"],Or.option=Or.optgroup=[1,'<select multiple="multiple">',"</select>"],Or.thead=Or.tbody=Or.colgroup=Or.caption=Or.tfoot=[1,"<table>","</table>"],Or.g=Or.defs=Or.symbol=Or.use=Or.image=Or.text=Or.circle=Or.ellipse=Or.line=Or.path=Or.polygon=Or.polyline=Or.rect=[1,'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events"version="1.1">',"</svg>"];var Tr=/<([\w:-]+)/,Nr=/&#?\w+?;/,jr=/<!--/,Er=function(){if(Ri){var t=document.createElement("div");return t.innerHTML="<template>1</template>",!t.cloneNode(!0).firstChild.innerHTML}return!1}(),Sr=function(){if(Ri){var t=document.createElement("textarea");return t.placeholder="t","t"===t.cloneNode(!0).value}return!1}(),Fr=Object.freeze({cloneNode:Zt,parseTemplate:Xt}),Dr={bind:function(){8===this.el.nodeType&&(this.nodes=[],this.anchor=nt("v-html"),J(this.el,this.anchor))},update:function(t){t=s(t),this.nodes?this.swap(t):this.el.innerHTML=t},swap:function(t){for(var e=this.nodes.length;e--;)z(this.nodes[e]);var i=Xt(t,!0,!0);this.nodes=d(i.childNodes),B(i,this.anchor)}};Yt.prototype.callHook=function(t){var e,i;for(e=0,i=this.childFrags.length;i>e;e++)this.childFrags[e].callHook(t);for(e=0,i=this.children.length;i>e;e++)t(this.children[e])},Yt.prototype.beforeRemove=function(){var t,e;for(t=0,e=this.childFrags.length;e>t;t++)this.childFrags[t].beforeRemove(!1);for(t=0,e=this.children.length;e>t;t++)this.children[t].$destroy(!1,!0);var i=this.unlink.dirs;for(t=0,e=i.length;e>t;t++)i[t]._watcher&&i[t]._watcher.teardown()},Yt.prototype.destroy=function(){this.parentFrag&&this.parentFrag.childFrags.$remove(this),this.node.__v_frag=null,this.unlink()};var Pr=new $(5e3);se.prototype.create=function(t,e,i){var n=Zt(this.template);return new Yt(this.linker,this.vm,n,t,e,i)};var Rr=700,Lr=800,Hr=850,Ir=1100,Mr=1500,Vr=1500,Br=1750,Wr=2100,zr=2200,Ur=2300,Jr=0,qr={priority:zr,terminal:!0,params:["track-by","stagger","enter-stagger","leave-stagger"],bind:function(){var t=this.expression.match(/(.*) (?:in|of) (.*)/);if(t){var e=t[1].match(/\((.*),(.*)\)/);e?(this.iterator=e[1].trim(),this.alias=e[2].trim()):this.alias=t[1].trim(),this.expression=t[2]}if(this.alias){this.id="__v-for__"+ ++Jr;var i=this.el.tagName;this.isOption=("OPTION"===i||"OPTGROUP"===i)&&"SELECT"===this.el.parentNode.tagName,this.start=nt("v-for-start"),this.end=nt("v-for-end"),J(this.el,this.end),B(this.start,this.end),this.cache=Object.create(null),this.factory=new se(this.vm,this.el)}},update:function(t){this.diff(t),this.updateRef(),this.updateModel()},diff:function(t){var e,n,r,s,o,a,h=t[0],l=this.fromObject=m(h)&&i(h,"$key")&&i(h,"$value"),c=this.params.trackBy,u=this.frags,f=this.frags=new Array(t.length),p=this.alias,d=this.iterator,v=this.start,g=this.end,_=H(v),y=!u;for(e=0,n=t.length;n>e;e++)h=t[e],s=l?h.$key:null,o=l?h.$value:h,a=!m(o),r=!y&&this.getCachedFrag(o,e,s),r?(r.reused=!0,r.scope.$index=e,s&&(r.scope.$key=s),d&&(r.scope[d]=null!==s?s:e),(c||l||a)&&yt(function(){r.scope[p]=o})):(r=this.create(o,p,e,s),r.fresh=!y),f[e]=r,y&&r.before(g);if(!y){var b=0,w=u.length-f.length;for(this.vm._vForRemoving=!0,e=0,n=u.length;n>e;e++)r=u[e],r.reused||(this.deleteCachedFrag(r),this.remove(r,b++,w,_));this.vm._vForRemoving=!1,b&&(this.vm._watchers=this.vm._watchers.filter(function(t){return t.active}));var C,$,k,x=0;for(e=0,n=f.length;n>e;e++)r=f[e],C=f[e-1],$=C?C.staggerCb?C.staggerAnchor:C.end||C.node:v,r.reused&&!r.staggerCb?(k=oe(r,v,this.id),k===C||k&&oe(k,v,this.id)===C||this.move(r,$)):this.insert(r,x++,$,_),r.reused=r.fresh=!1}},create:function(t,e,i,n){var r=this._host,s=this._scope||this.vm,o=Object.create(s);o.$refs=Object.create(s.$refs),o.$els=Object.create(s.$els),o.$parent=s,o.$forContext=this,yt(function(){kt(o,e,t)}),kt(o,"$index",i),n?kt(o,"$key",n):o.$key&&_(o,"$key",null),this.iterator&&kt(o,this.iterator,null!==n?n:i);var a=this.factory.create(r,o,this._frag);return a.forId=this.id,this.cacheFrag(t,a,i,n),a},updateRef:function(){var t=this.descriptor.ref;if(t){var e,i=(this._scope||this.vm).$refs;this.fromObject?(e={},this.frags.forEach(function(t){e[t.scope.$key]=ae(t)})):e=this.frags.map(ae),i[t]=e}},updateModel:function(){if(this.isOption){var t=this.start.parentNode,e=t&&t.__v_model;e&&e.forceUpdate()}},insert:function(t,e,i,n){t.staggerCb&&(t.staggerCb.cancel(),t.staggerCb=null);var r=this.getStagger(t,e,null,"enter");if(n&&r){var s=t.staggerAnchor;s||(s=t.staggerAnchor=nt("stagger-anchor"),s.__v_frag=t),W(s,i);var o=t.staggerCb=w(function(){t.staggerCb=null,t.before(s),z(s)});setTimeout(o,r)}else{var a=i.nextSibling;a||(W(this.end,i),a=this.end),t.before(a)}},remove:function(t,e,i,n){if(t.staggerCb)return t.staggerCb.cancel(),void(t.staggerCb=null);var r=this.getStagger(t,e,i,"leave");if(n&&r){var s=t.staggerCb=w(function(){t.staggerCb=null,t.remove()});setTimeout(s,r)}else t.remove()},move:function(t,e){e.nextSibling||this.end.parentNode.appendChild(this.end),t.before(e.nextSibling,!1)},cacheFrag:function(t,e,n,r){var s,o=this.params.trackBy,a=this.cache,h=!m(t);r||o||h?(s=le(n,r,t,o),a[s]||(a[s]=e)):(s=this.id,i(t,s)?null===t[s]&&(t[s]=e):Object.isExtensible(t)&&_(t,s,e)),e.raw=t},getCachedFrag:function(t,e,i){var n,r=this.params.trackBy,s=!m(t);if(i||r||s){var o=le(e,i,t,r);n=this.cache[o]}else n=t[this.id];return n&&(n.reused||n.fresh),n},deleteCachedFrag:function(t){var e=t.raw,n=this.params.trackBy,r=t.scope,s=r.$index,o=i(r,"$key")&&r.$key,a=!m(e);if(n||o||a){var h=le(s,o,e,n);this.cache[h]=null}else e[this.id]=null,t.raw=null},getStagger:function(t,e,i,n){n+="Stagger";var r=t.node.__v_trans,s=r&&r.hooks,o=s&&(s[n]||s.stagger);return o?o.call(t,e,i):e*parseInt(this.params[n]||this.params.stagger,10)},_preProcess:function(t){return this.rawValue=t,t},_postProcess:function(t){if(Di(t))return t;if(g(t)){for(var e,i=Object.keys(t),n=i.length,r=new Array(n);n--;)e=i[n],r[n]={$key:e,$value:t[e]};return r}return"number"!=typeof t||isNaN(t)||(t=he(t)),t||[]},unbind:function(){if(this.descriptor.ref&&((this._scope||this.vm).$refs[this.descriptor.ref]=null),this.frags)for(var t,e=this.frags.length;e--;)t=this.frags[e],this.deleteCachedFrag(t),t.destroy()}},Qr={priority:Wr,terminal:!0,bind:function(){var t=this.el;if(t.__vue__)this.invalid=!0;else{var e=t.nextElementSibling;e&&null!==I(e,"v-else")&&(z(e),this.elseEl=e),this.anchor=nt("v-if"),J(t,this.anchor)}},update:function(t){this.invalid||(t?this.frag||this.insert():this.remove())},insert:function(){this.elseFrag&&(this.elseFrag.remove(),this.elseFrag=null),this.factory||(this.factory=new se(this.vm,this.el)),this.frag=this.factory.create(this._host,this._scope,this._frag),this.frag.before(this.anchor)},remove:function(){this.frag&&(this.frag.remove(),this.frag=null),this.elseEl&&!this.elseFrag&&(this.elseFactory||(this.elseFactory=new se(this.elseEl._context||this.vm,this.elseEl)),this.elseFrag=this.elseFactory.create(this._host,this._scope,this._frag),this.elseFrag.before(this.anchor))},unbind:function(){this.frag&&this.frag.destroy(),this.elseFrag&&this.elseFrag.destroy()}},Gr={bind:function(){var t=this.el.nextElementSibling;t&&null!==I(t,"v-else")&&(this.elseEl=t)},update:function(t){this.apply(this.el,t),this.elseEl&&this.apply(this.elseEl,!t)},apply:function(t,e){function i(){t.style.display=e?"":"none"}H(t)?R(t,e?1:-1,i,this.vm):i()}},Zr={bind:function(){var t=this,e=this.el,i="range"===e.type,n=this.params.lazy,r=this.params.number,s=this.params.debounce,a=!1;if(Vi||i||(this.on("compositionstart",function(){a=!0}),this.on("compositionend",function(){a=!1,n||t.listener()})),this.focused=!1,i||n||(this.on("focus",function(){t.focused=!0}),this.on("blur",function(){t.focused=!1,t._frag&&!t._frag.inserted||t.rawListener()})),this.listener=this.rawListener=function(){if(!a&&t._bound){var n=r||i?o(e.value):e.value;t.set(n),Yi(function(){t._bound&&!t.focused&&t.update(t._watcher.value)})}},s&&(this.listener=y(this.listener,s)),this.hasjQuery="function"==typeof jQuery,this.hasjQuery){var h=jQuery.fn.on?"on":"bind";jQuery(e)[h]("change",this.rawListener),n||jQuery(e)[h]("input",this.listener)}else this.on("change",this.rawListener),n||this.on("input",this.listener);!n&&Mi&&(this.on("cut",function(){Yi(t.listener)}),this.on("keyup",function(e){46!==e.keyCode&&8!==e.keyCode||t.listener()})),(e.hasAttribute("value")||"TEXTAREA"===e.tagName&&e.value.trim())&&(this.afterBind=this.listener)},update:function(t){t=s(t),t!==this.el.value&&(this.el.value=t)},unbind:function(){var t=this.el;if(this.hasjQuery){var e=jQuery.fn.off?"off":"unbind";jQuery(t)[e]("change",this.listener),jQuery(t)[e]("input",this.listener)}}},Xr={bind:function(){var t=this,e=this.el;this.getValue=function(){if(e.hasOwnProperty("_value"))return e._value;var i=e.value;return t.params.number&&(i=o(i)),i},this.listener=function(){t.set(t.getValue())},this.on("change",this.listener),e.hasAttribute("checked")&&(this.afterBind=this.listener)},update:function(t){this.el.checked=C(t,this.getValue())}},Yr={bind:function(){var t=this,e=this,i=this.el;this.forceUpdate=function(){e._watcher&&e.update(e._watcher.get())};var n=this.multiple=i.hasAttribute("multiple");this.listener=function(){var t=ce(i,n);t=e.params.number?Di(t)?t.map(o):o(t):t,e.set(t)},this.on("change",this.listener);var r=ce(i,n,!0);(n&&r.length||!n&&null!==r)&&(this.afterBind=this.listener),this.vm.$on("hook:attached",function(){Yi(t.forceUpdate)}),H(i)||Yi(this.forceUpdate)},update:function(t){var e=this.el;e.selectedIndex=-1;for(var i,n,r=this.multiple&&Di(t),s=e.options,o=s.length;o--;)i=s[o],n=i.hasOwnProperty("_value")?i._value:i.value,i.selected=r?ue(t,n)>-1:C(t,n)},unbind:function(){this.vm.$off("hook:attached",this.forceUpdate)}},Kr={bind:function(){function t(){var t=i.checked;return t&&i.hasOwnProperty("_trueValue")?i._trueValue:!t&&i.hasOwnProperty("_falseValue")?i._falseValue:t}var e=this,i=this.el;this.getValue=function(){return i.hasOwnProperty("_value")?i._value:e.params.number?o(i.value):i.value},this.listener=function(){var n=e._watcher.value;if(Di(n)){var r=e.getValue();i.checked?b(n,r)<0&&n.push(r):n.$remove(r)}else e.set(t())},this.on("change",this.listener),i.hasAttribute("checked")&&(this.afterBind=this.listener)},update:function(t){var e=this.el;Di(t)?e.checked=b(t,this.getValue())>-1:e.hasOwnProperty("_trueValue")?e.checked=C(t,e._trueValue):e.checked=!!t}},ts={text:Zr,radio:Xr,select:Yr,checkbox:Kr},es={priority:Lr,twoWay:!0,handlers:ts,params:["lazy","number","debounce"],bind:function(){this.checkFilters(),this.hasRead&&!this.hasWrite;var t,e=this.el,i=e.tagName;if("INPUT"===i)t=ts[e.type]||ts.text;else if("SELECT"===i)t=ts.select;else{if("TEXTAREA"!==i)return;t=ts.text}e.__v_model=this,t.bind.call(this),this.update=t.update,this._unbind=t.unbind},checkFilters:function(){var t=this.filters;if(t)for(var e=t.length;e--;){var i=gt(this.vm.$options,"filters",t[e].name);("function"==typeof i||i.read)&&(this.hasRead=!0),i.write&&(this.hasWrite=!0)}},unbind:function(){this.el.__v_model=null,this._unbind&&this._unbind()}},is={esc:27,tab:9,enter:13,space:32,"delete":[8,46],up:38,left:37,right:39,down:40},ns={priority:Rr,acceptStatement:!0,keyCodes:is,bind:function(){if("IFRAME"===this.el.tagName&&"load"!==this.arg){var t=this;this.iframeBind=function(){q(t.el.contentWindow,t.arg,t.handler,t.modifiers.capture)},this.on("load",this.iframeBind)}},update:function(t){if(this.descriptor.raw||(t=function(){}),"function"==typeof t){this.modifiers.stop&&(t=pe(t)),this.modifiers.prevent&&(t=de(t)),this.modifiers.self&&(t=ve(t));var e=Object.keys(this.modifiers).filter(function(t){return"stop"!==t&&"prevent"!==t&&"self"!==t&&"capture"!==t});e.length&&(t=fe(t,e)),this.reset(),this.handler=t,this.iframeBind?this.iframeBind():q(this.el,this.arg,this.handler,this.modifiers.capture)}},reset:function(){var t=this.iframeBind?this.el.contentWindow:this.el;this.handler&&Q(t,this.arg,this.handler)},unbind:function(){this.reset()}},rs=["-webkit-","-moz-","-ms-"],ss=["Webkit","Moz","ms"],os=/!important;?$/,as=Object.create(null),hs=null,ls={deep:!0,update:function(t){"string"==typeof t?this.el.style.cssText=t:Di(t)?this.handleObject(t.reduce(v,{})):this.handleObject(t||{})},handleObject:function(t){var e,i,n=this.cache||(this.cache={});for(e in n)e in t||(this.handleSingle(e,null),delete n[e]);for(e in t)i=t[e],i!==n[e]&&(n[e]=i,this.handleSingle(e,i))},handleSingle:function(t,e){if(t=me(t))if(null!=e&&(e+=""),e){var i=os.test(e)?"important":"";i?(e=e.replace(os,"").trim(),this.el.style.setProperty(t.kebab,e,i)):this.el.style[t.camel]=e}else this.el.style[t.camel]=""}},cs="http://www.w3.org/1999/xlink",us=/^xlink:/,fs=/^v-|^:|^@|^(?:is|transition|transition-mode|debounce|track-by|stagger|enter-stagger|leave-stagger)$/,ps=/^(?:value|checked|selected|muted)$/,ds=/^(?:draggable|contenteditable|spellcheck)$/,vs={value:"_value","true-value":"_trueValue","false-value":"_falseValue"},ms={priority:Hr,bind:function(){var t=this.arg,e=this.el.tagName;t||(this.deep=!0);var i=this.descriptor,n=i.interp;n&&(i.hasOneTime&&(this.expression=j(n,this._scope||this.vm)),(fs.test(t)||"name"===t&&("PARTIAL"===e||"SLOT"===e))&&(this.el.removeAttribute(t),this.invalid=!0))},update:function(t){
if(!this.invalid){var e=this.arg;this.arg?this.handleSingle(e,t):this.handleObject(t||{})}},handleObject:ls.handleObject,handleSingle:function(t,e){var i=this.el,n=this.descriptor.interp;if(this.modifiers.camel&&(t=l(t)),!n&&ps.test(t)&&t in i){var r="value"===t&&null==e?"":e;i[t]!==r&&(i[t]=r)}var s=vs[t];if(!n&&s){i[s]=e;var o=i.__v_model;o&&o.listener()}return"value"===t&&"TEXTAREA"===i.tagName?void i.removeAttribute(t):void(ds.test(t)?i.setAttribute(t,e?"true":"false"):null!=e&&e!==!1?"class"===t?(i.__v_trans&&(e+=" "+i.__v_trans.id+"-transition"),Z(i,e)):us.test(t)?i.setAttributeNS(cs,t,e===!0?"":e):i.setAttribute(t,e===!0?"":e):i.removeAttribute(t))}},gs={priority:Mr,bind:function(){if(this.arg){var t=this.id=l(this.arg),e=(this._scope||this.vm).$els;i(e,t)?e[t]=this.el:kt(e,t,this.el)}},unbind:function(){var t=(this._scope||this.vm).$els;t[this.id]===this.el&&(t[this.id]=null)}},_s={bind:function(){}},ys={bind:function(){var t=this.el;this.vm.$once("pre-hook:compiled",function(){t.removeAttribute("v-cloak")})}},bs={text:kr,html:Dr,"for":qr,"if":Qr,show:Gr,model:es,on:ns,bind:ms,el:gs,ref:_s,cloak:ys},ws={deep:!0,update:function(t){t?"string"==typeof t?this.setClass(t.trim().split(/\s+/)):this.setClass(_e(t)):this.cleanup()},setClass:function(t){this.cleanup(t);for(var e=0,i=t.length;i>e;e++){var n=t[e];n&&ye(this.el,n,X)}this.prevKeys=t},cleanup:function(t){var e=this.prevKeys;if(e)for(var i=e.length;i--;){var n=e[i];(!t||t.indexOf(n)<0)&&ye(this.el,n,Y)}}},Cs={priority:Vr,params:["keep-alive","transition-mode","inline-template"],bind:function(){this.el.__vue__||(this.keepAlive=this.params.keepAlive,this.keepAlive&&(this.cache={}),this.params.inlineTemplate&&(this.inlineTemplate=K(this.el,!0)),this.pendingComponentCb=this.Component=null,this.pendingRemovals=0,this.pendingRemovalCb=null,this.anchor=nt("v-component"),J(this.el,this.anchor),this.el.removeAttribute("is"),this.el.removeAttribute(":is"),this.descriptor.ref&&this.el.removeAttribute("v-ref:"+u(this.descriptor.ref)),this.literal&&this.setComponent(this.expression))},update:function(t){this.literal||this.setComponent(t)},setComponent:function(t,e){if(this.invalidatePending(),t){var i=this;this.resolveComponent(t,function(){i.mountComponent(e)})}else this.unbuild(!0),this.remove(this.childVM,e),this.childVM=null},resolveComponent:function(t,e){var i=this;this.pendingComponentCb=w(function(n){i.ComponentName=n.options.name||("string"==typeof t?t:null),i.Component=n,e()}),this.vm._resolveComponent(t,this.pendingComponentCb)},mountComponent:function(t){this.unbuild(!0);var e=this,i=this.Component.options.activate,n=this.getCached(),r=this.build();i&&!n?(this.waitingFor=r,be(i,r,function(){e.waitingFor===r&&(e.waitingFor=null,e.transition(r,t))})):(n&&r._updateRef(),this.transition(r,t))},invalidatePending:function(){this.pendingComponentCb&&(this.pendingComponentCb.cancel(),this.pendingComponentCb=null)},build:function(t){var e=this.getCached();if(e)return e;if(this.Component){var i={name:this.ComponentName,el:Zt(this.el),template:this.inlineTemplate,parent:this._host||this.vm,_linkerCachable:!this.inlineTemplate,_ref:this.descriptor.ref,_asComponent:!0,_isRouterView:this._isRouterView,_context:this.vm,_scope:this._scope,_frag:this._frag};t&&v(i,t);var n=new this.Component(i);return this.keepAlive&&(this.cache[this.Component.cid]=n),n}},getCached:function(){return this.keepAlive&&this.cache[this.Component.cid]},unbuild:function(t){this.waitingFor&&(this.keepAlive||this.waitingFor.$destroy(),this.waitingFor=null);var e=this.childVM;return!e||this.keepAlive?void(e&&(e._inactive=!0,e._updateRef(!0))):void e.$destroy(!1,t)},remove:function(t,e){var i=this.keepAlive;if(t){this.pendingRemovals++,this.pendingRemovalCb=e;var n=this;t.$remove(function(){n.pendingRemovals--,i||t._cleanup(),!n.pendingRemovals&&n.pendingRemovalCb&&(n.pendingRemovalCb(),n.pendingRemovalCb=null)})}else e&&e()},transition:function(t,e){var i=this,n=this.childVM;switch(n&&(n._inactive=!0),t._inactive=!1,this.childVM=t,i.params.transitionMode){case"in-out":t.$before(i.anchor,function(){i.remove(n,e)});break;case"out-in":i.remove(n,function(){t.$before(i.anchor,e)});break;default:i.remove(n),t.$before(i.anchor,e)}},unbind:function(){if(this.invalidatePending(),this.unbuild(),this.cache){for(var t in this.cache)this.cache[t].$destroy();this.cache=null}}},$s=An._propBindingModes,ks={},xs=/^[$_a-zA-Z]+[\w$]*$/,As=An._propBindingModes,Os={bind:function(){var t=this.vm,e=t._context,i=this.descriptor.prop,n=i.path,r=i.parentPath,s=i.mode===As.TWO_WAY,o=this.parentWatcher=new Ut(e,r,function(e){xe(t,i,e)},{twoWay:s,filters:i.filters,scope:this._scope});if(ke(t,i,o.value),s){var a=this;t.$once("pre-hook:created",function(){a.childWatcher=new Ut(t,n,function(t){o.set(t)},{sync:!0})})}},unbind:function(){this.parentWatcher.teardown(),this.childWatcher&&this.childWatcher.teardown()}},Ts=[],Ns=!1,js="transition",Es="animation",Ss=Ji+"Duration",Fs=Qi+"Duration",Ds=Ri&&window.requestAnimationFrame,Ps=Ds?function(t){Ds(function(){Ds(t)})}:function(t){setTimeout(t,50)},Rs=Se.prototype;Rs.enter=function(t,e){this.cancelPending(),this.callHook("beforeEnter"),this.cb=e,X(this.el,this.enterClass),t(),this.entered=!1,this.callHookWithCb("enter"),this.entered||(this.cancel=this.hooks&&this.hooks.enterCancelled,je(this.enterNextTick))},Rs.enterNextTick=function(){var t=this;this.justEntered=!0,Ps(function(){t.justEntered=!1});var e=this.enterDone,i=this.getCssTransitionType(this.enterClass);this.pendingJsCb?i===js&&Y(this.el,this.enterClass):i===js?(Y(this.el,this.enterClass),this.setupCssCb(qi,e)):i===Es?this.setupCssCb(Gi,e):e()},Rs.enterDone=function(){this.entered=!0,this.cancel=this.pendingJsCb=null,Y(this.el,this.enterClass),this.callHook("afterEnter"),this.cb&&this.cb()},Rs.leave=function(t,e){this.cancelPending(),this.callHook("beforeLeave"),this.op=t,this.cb=e,X(this.el,this.leaveClass),this.left=!1,this.callHookWithCb("leave"),this.left||(this.cancel=this.hooks&&this.hooks.leaveCancelled,this.op&&!this.pendingJsCb&&(this.justEntered?this.leaveDone():je(this.leaveNextTick)))},Rs.leaveNextTick=function(){var t=this.getCssTransitionType(this.leaveClass);if(t){var e=t===js?qi:Gi;this.setupCssCb(e,this.leaveDone)}else this.leaveDone()},Rs.leaveDone=function(){this.left=!0,this.cancel=this.pendingJsCb=null,this.op(),Y(this.el,this.leaveClass),this.callHook("afterLeave"),this.cb&&this.cb(),this.op=null},Rs.cancelPending=function(){this.op=this.cb=null;var t=!1;this.pendingCssCb&&(t=!0,Q(this.el,this.pendingCssEvent,this.pendingCssCb),this.pendingCssEvent=this.pendingCssCb=null),this.pendingJsCb&&(t=!0,this.pendingJsCb.cancel(),this.pendingJsCb=null),t&&(Y(this.el,this.enterClass),Y(this.el,this.leaveClass)),this.cancel&&(this.cancel.call(this.vm,this.el),this.cancel=null)},Rs.callHook=function(t){this.hooks&&this.hooks[t]&&this.hooks[t].call(this.vm,this.el)},Rs.callHookWithCb=function(t){var e=this.hooks&&this.hooks[t];e&&(e.length>1&&(this.pendingJsCb=w(this[t+"Done"])),e.call(this.vm,this.el,this.pendingJsCb))},Rs.getCssTransitionType=function(t){if(!(!qi||document.hidden||this.hooks&&this.hooks.css===!1||Fe(this.el))){var e=this.type||this.typeCache[t];if(e)return e;var i=this.el.style,n=window.getComputedStyle(this.el),r=i[Ss]||n[Ss];if(r&&"0s"!==r)e=js;else{var s=i[Fs]||n[Fs];s&&"0s"!==s&&(e=Es)}return e&&(this.typeCache[t]=e),e}},Rs.setupCssCb=function(t,e){this.pendingCssEvent=t;var i=this,n=this.el,r=this.pendingCssCb=function(s){s.target===n&&(Q(n,t,r),i.pendingCssEvent=i.pendingCssCb=null,!i.pendingJsCb&&e&&e())};q(n,t,r)};var Ls={priority:Ir,update:function(t,e){var i=this.el,n=gt(this.vm.$options,"transitions",t);t=t||"v",e=e||"v",i.__v_trans=new Se(i,t,n,this.vm),Y(i,e+"-transition"),X(i,t+"-transition")}},Hs={style:ls,"class":ws,component:Cs,prop:Os,transition:Ls},Is=/^v-bind:|^:/,Ms=/^v-on:|^@/,Vs=/^v-([^:]+)(?:$|:(.*)$)/,Bs=/\.[^\.]+/g,Ws=/^(v-bind:|:)?transition$/,zs=1e3,Us=2e3;Ye.terminal=!0;var Js=/[^\w\-:\.]/,qs=Object.freeze({compile:De,compileAndLinkProps:Ie,compileRoot:Me,transclude:si,resolveSlots:li}),Qs=/^v-on:|^@/;di.prototype._bind=function(){var t=this.name,e=this.descriptor;if(("cloak"!==t||this.vm._isCompiled)&&this.el&&this.el.removeAttribute){var i=e.attr||"v-"+t;this.el.removeAttribute(i)}var n=e.def;if("function"==typeof n?this.update=n:v(this,n),this._setupParams(),this.bind&&this.bind(),this._bound=!0,this.literal)this.update&&this.update(e.raw);else if((this.expression||this.modifiers)&&(this.update||this.twoWay)&&!this._checkStatement()){var r=this;this.update?this._update=function(t,e){r._locked||r.update(t,e)}:this._update=pi;var s=this._preProcess?p(this._preProcess,this):null,o=this._postProcess?p(this._postProcess,this):null,a=this._watcher=new Ut(this.vm,this.expression,this._update,{filters:this.filters,twoWay:this.twoWay,deep:this.deep,preProcess:s,postProcess:o,scope:this._scope});this.afterBind?this.afterBind():this.update&&this.update(a.value)}},di.prototype._setupParams=function(){if(this.params){var t=this.params;this.params=Object.create(null);for(var e,i,n,r=t.length;r--;)e=u(t[r]),n=l(e),i=M(this.el,e),null!=i?this._setupParamWatcher(n,i):(i=I(this.el,e),null!=i&&(this.params[n]=""===i?!0:i))}},di.prototype._setupParamWatcher=function(t,e){var i=this,n=!1,r=(this._scope||this.vm).$watch(e,function(e,r){if(i.params[t]=e,n){var s=i.paramWatchers&&i.paramWatchers[t];s&&s.call(i,e,r)}else n=!0},{immediate:!0,user:!1});(this._paramUnwatchFns||(this._paramUnwatchFns=[])).push(r)},di.prototype._checkStatement=function(){var t=this.expression;if(t&&this.acceptStatement&&!Mt(t)){var e=It(t).get,i=this._scope||this.vm,n=function(t){i.$event=t,e.call(i,i),i.$event=null};return this.filters&&(n=i._applyFilters(n,null,this.filters)),this.update(n),!0}},di.prototype.set=function(t){this.twoWay&&this._withLock(function(){this._watcher.set(t)})},di.prototype._withLock=function(t){var e=this;e._locked=!0,t.call(e),Yi(function(){e._locked=!1})},di.prototype.on=function(t,e,i){q(this.el,t,e,i),(this._listeners||(this._listeners=[])).push([t,e])},di.prototype._teardown=function(){if(this._bound){this._bound=!1,this.unbind&&this.unbind(),this._watcher&&this._watcher.teardown();var t,e=this._listeners;if(e)for(t=e.length;t--;)Q(this.el,e[t][0],e[t][1]);var i=this._paramUnwatchFns;if(i)for(t=i.length;t--;)i[t]();this.vm=this.el=this._watcher=this._listeners=null}};var Gs=/[^|]\|[^|]/;xt(wi),ui(wi),fi(wi),vi(wi),mi(wi),gi(wi),_i(wi),yi(wi),bi(wi);var Zs={priority:Ur,params:["name"],bind:function(){var t=this.params.name||"default",e=this.vm._slotContents&&this.vm._slotContents[t];e&&e.hasChildNodes()?this.compile(e.cloneNode(!0),this.vm._context,this.vm):this.fallback()},compile:function(t,e,i){if(t&&e){if(this.el.hasChildNodes()&&1===t.childNodes.length&&1===t.childNodes[0].nodeType&&t.childNodes[0].hasAttribute("v-if")){var n=document.createElement("template");n.setAttribute("v-else",""),n.innerHTML=this.el.innerHTML,n._context=this.vm,t.appendChild(n)}var r=i?i._scope:this._scope;this.unlink=e.$compile(t,i,r,this._frag)}t?J(this.el,t):z(this.el)},fallback:function(){this.compile(K(this.el,!0),this.vm)},unbind:function(){this.unlink&&this.unlink()}},Xs={priority:Br,params:["name"],paramWatchers:{name:function(t){Qr.remove.call(this),t&&this.insert(t)}},bind:function(){this.anchor=nt("v-partial"),J(this.el,this.anchor),this.insert(this.params.name)},insert:function(t){var e=gt(this.vm.$options,"partials",t,!0);e&&(this.factory=new se(this.vm,e),Qr.insert.call(this))},unbind:function(){this.frag&&this.frag.destroy()}},Ys={slot:Zs,partial:Xs},Ks=qr._postProcess,to=/(\d{3})(?=\d)/g,eo={orderBy:ki,filterBy:$i,limitBy:Ci,json:{read:function(t,e){return"string"==typeof t?t:JSON.stringify(t,null,arguments.length>1?e:2)},write:function(t){try{return JSON.parse(t)}catch(e){return t}}},capitalize:function(t){return t||0===t?(t=t.toString(),t.charAt(0).toUpperCase()+t.slice(1)):""},uppercase:function(t){return t||0===t?t.toString().toUpperCase():""},lowercase:function(t){return t||0===t?t.toString().toLowerCase():""},currency:function(t,e,i){if(t=parseFloat(t),!isFinite(t)||!t&&0!==t)return"";e=null!=e?e:"$",i=null!=i?i:2;var n=Math.abs(t).toFixed(i),r=i?n.slice(0,-1-i):n,s=r.length%3,o=s>0?r.slice(0,s)+(r.length>3?",":""):"",a=i?n.slice(-1-i):"",h=0>t?"-":"";return h+e+o+r.slice(s).replace(to,"$1,")+a},pluralize:function(t){var e=d(arguments,1),i=e.length;if(i>1){var n=t%10-1;return n in e?e[n]:e[i-1]}return e[0]+(1===t?"":"s")},debounce:function(t,e){return t?(e||(e=300),y(t,e)):void 0}};return Ai(wi),wi.version="1.0.26",setTimeout(function(){An.devtools&&Li&&Li.emit("init",wi)},0),wi});
//# sourceMappingURL=vue.min.js.map
// Vue Customizations specific to Social Fixer
Vue.directive('tooltip', function (o) {
    this.el.setAttribute('data-hover','tooltip');
    if (o) {
        o.content && this.el.setAttribute('data-tooltip-content', o.content);
        this.el.setAttribute('data-tooltip-delay', (typeof o.delay!="undefined") ? o.delay : 1000);
        o.position && this.el.setAttribute('data-tooltip-position', o.position);
        o.align && this.el.setAttribute('data-tooltip-alignh', o.align);
        if (o.icon) {
            this.el.className="sfx-help-icon";
            this.el.setAttribute('data-tooltip-delay',1);
        }
    }
    else {
        this.el.setAttribute('data-tooltip-content', this.expression);
        this.el.setAttribute('data-tooltip-delay', "1000");
    }
});

/*
 * This is a small library specific to Facebook functionality / extensions
 */
var FX = (function() {
    var css_queue = [];
    var on_page_load_queue = [];
    var on_page_unload_queue = [];
    var on_content_loaded_queue = [];
    var on_options_load_queue = [];
    var html_class_names = [];

    var fire_queue = function (arr, reset, arg) {
        if (!arr || !arr.length) {
            return;
        }
        arr.forEach(function (func) {
            try {
                func(arg);
            } catch(e) {
                console.log(e.toString());
            }
        });
        if (reset) {
            arr.length = 0;
        }
    };

    // Monitor for hash change to detect when navigation has happened
    // TODO: Even for popups like photo viewer?!
    var page_transitioning = false;
    var page_transition = function() {
        if (page_transitioning) { return; } // Already initiated
        page_transitioning = true;
        // Fire the unload queue
        fire_queue(on_page_unload_queue);
        page_transitioning = false;
        fire_queue(on_page_load_queue);
    };
    // Monkey patch the pushState/replaceState calls in the main window to capture the event.
    // This will tell us if navigation happened that wasn't a full page reload
    // Detect changes through window.addEventListener(pushState|replaceState)
    var watch_history = function() {
        var _wr = function (type) {
            var orig = history[type];
            return function (state,title,url) {
                var url_change = (url && url!=location.href && !/theater/.test(url));
                var rv = orig.apply(this, arguments);
                if (url_change) {
                    var e = new Event(type);
                    e.arguments = arguments;
                    window.dispatchEvent(e);
                }
                return rv;
            };
        };
        window.history.pushState = _wr('pushState');
        window.history.replaceState = _wr('replaceState');
    };
    X.inject(watch_history);
    // Now listen for the state change events
    window.addEventListener("pushState",page_transition,false);
    window.addEventListener("replaceState",page_transition,false);

    // Facebook uses the HTML5 window.history.pushState() method to change url's in newer browsers.
    // Older browsers will use the hashchange approach
    window.addEventListener('hashchange',page_transition,false);
    window.addEventListener('DOMContentLoaded',function() {
    });

    // Public API
    var fx = {};
    fx.css = function(css_text) {
        css_queue.push(css_text);
    };
    fx.css_dump = function() {
        if (css_queue.length==0) { return; }
        var css = css_queue.join('');
        css_queue.length=0;
        X.css(css,'sfx_css');
    };

    // OPTIONS
    // -------
    // options : A hash of ALL available options, as defined by modules, along with default values
    fx.options = {};
    // is_options_loaded : Once options is loaded, this flag flips
    fx.is_options_loaded = false;
    fx.add_option = function(key,o) {
        o = o || {};
        o.key = key;
        o.type = o.type || 'checkbox';
        if (typeof o['default']=="undefined" && o.type=="checkbox") {
            o['default'] = false;
        }
        this.options[key] = o;
    };
    fx.option =function(key,value,save,callback) {
        // The defined option
        var o = fx.options[key];
        if (typeof value!="undefined") {
            // SET the value
            X.storage.set('options',key,value,(callback || function(){}),save);
            return value;
        }
        // GET the value
        // If it's defined in the storage layer, get that
        if (typeof X.storage.data.options!="undefined" && typeof X.storage.data.options[key]!="undefined") {
            return X.storage.data.options[key];
        }
        // Else if it's defined as an option, return the default value
        if (typeof o!="undefined" && typeof o['default']!="undefined") {
            return o['default'];
        }
        // Default return null
        return null;
    };
    fx.save_options = function(callback) {
        X.storage.save('options',null,callback);
    };
    fx.options_loaded = function(options) {
        fire_queue(on_options_load_queue,false,options);
        FX.css_dump();
        FX.html_class_dump();
        fx.is_options_loaded=true;
    };
    fx.on_options_load = function(func) {
        // If options are already loaded, just fire the func
        if (fx.is_options_loaded) {
            func();
        }
        else {
            on_options_load_queue.push(func);
        }
    };
    // Pass-through to non-option storage
    fx.storage = function(key) {
        return X.storage.data[key];
    };

    fx.add_html_class = function(name) {
        html_class_names.push(name);
        if (X.is_document_ready()) {
            FX.html_class_dump();
        }
    };
    fx.html_class_dump = function() {
        // Add HTML classes to the HTML tag
        if (html_class_names.length>0) {
            var h=document.getElementsByTagName('HTML')[0];
            h.className = (h.className?h.className:'') + ' ' + html_class_names.join(' ');
            html_class_names.length = 0;
        }
    };
    fx.on_page_load = function(func) {
        on_page_load_queue.push(func);
    };
    fx.on_page_unload = function(func) {
        on_page_unload_queue.push(func);
    };
    fx.on_content_loaded = function(func) {
        on_content_loaded_queue.push(func);
    };
	fx.dom_content_loaded = false;
    fx.fire_content_loaded = function() {
        // Queue or Fire the DOMContentLoaded functions
        var content_loaded = function() {
			FX.html_class_dump();
            fire_queue(on_content_loaded_queue,true);
            fire_queue(on_page_load_queue);
            FX.html_class_dump();
        };
        if (X.is_document_ready()) {
            content_loaded();
        }
        else {
            window.addEventListener('DOMContentLoaded',function() {
				content_loaded();
			},false);
        }
    };

    // Dynamic content insertion
    fx.domNodeInsertedHandlers = [];
    fx.on_content_inserted = function(func) {
        fx.domNodeInsertedHandlers.push(func);
    };
    fx.on_content = function(func) {
        // Inserted content
        fx.on_content_inserted(func);
        // Static content on page load
        fx.on_content_loaded(function() {
            func(X(document.body));
        });
    };

    // Navigation Context
    fx.context = {"type":null, "id":null};
    fx.on_page_load(function() {
        var url = window.location.href;
        url = url.replace(/^.*?facebook.com/,"");
        url = url.replace(/\?.*$/,"");

        if (url=="/") {
            fx.context.type="newsfeed";
            fx.context.id=null;
        }
        else {
            fx.context.type=null;
            fx.context.id=null;
            var context = url.match(/\/([^\/]+)\/([^\/]+)/);
            if (context) {
                fx.context.type=context[1];
                fx.context.id=context[2];
            }
            else {
                fx.context.type="profile";
                fx.context.id = (url.match(/^\/([^\/]+)/))[1];
            }
        }
        fx.context.permalink = false;
        if (/permalink/.test(url) || /\/posts\/\d+/.test(url)) {
            fx.context.permalink = true;
        }
        var $html = X('html');
        $html.attr('sfx_url',url);
        $html.attr('sfx_context_type',fx.context.type);
        $html.attr('sfx_context_id',fx.context.id);
        $html.attr('sfx_context_permalink',fx.context.permalink);

        // DEBUG
        //bubble_note(url+"<br>"+fx.context.type+"<br>"+fx.context.id, {id:"sfxcontext",draggable:false});
    });

    // "Reflow" a news feed page when posts have been hidden/shown, so Facebook's code kicks in and resizes containers
    fx.reflow = function(scroll_to_top) {
        if (typeof scroll_to_top!="boolean") { scroll_to_top=false; }
        // Show all substreams by force
        try { X('div[id^="substream_"]').css('height', 'auto').find('.hidden_elem').removeClass('hidden_elem'); } catch(e) {}
        // Trigger Facebook's code to re-flow
        setTimeout(function() {
//        window.dispatchEvent(new Event('resize'));
            if (scroll_to_top) {
                window.scrollTo(0, 3);
            }
        },50);
    };

    fx.mutations_disabled = false;
	fx.disable_mutations = function() { fx.mutations_disabled=true; }
	fx.enable_mutations = function() { fx.mutations_disabled=false; }
    var ignoreDomInsertedRegex = /(sfx|DOMControl_shadow|highlighterContent|uiContextualLayerPositioner|uiContextualDialogPositioner|UFIList|timestampContent|tooltipText)/i;
    var ignoreDomInsertedParentRegex = /(highlighter|fbChatOrderedList)/;
    var ignoreTagNamesRegex = /^SCRIPT|LINK|INPUT|BR|STYLE|META|IFRAME|AUDIO|EMBED$/i;
    var ignoreMutation = function(o) {
        if (o.nodeType!=1) { return true; }
        if (ignoreTagNamesRegex.test(o.tagName)) { return true; }
        if (ignoreDomInsertedRegex.test(o.className) || /sfx/.test(o.id)) { return true; }
        if (o.parentNode && o.parentNode.className && ignoreDomInsertedParentRegex.test(o.parentNode.className)) {
            return true;
        }
		return fx.mutations_disabled;
    };
    var domnodeinserted = function (o) {
        if (ignoreMutation(o)) { return; }
        var $o = X(o);
        for (var i=0; i<fx.domNodeInsertedHandlers.length; i++) {
            // If a handler returns true, it has handled it, no need to continue to other handlers
            if (fx.domNodeInsertedHandlers[i]($o)) {
                return;
            }
        }
    };
    if (typeof MutationObserver!="undefined" || global_options.use_mutation_observers) {
        var _observer = function(records) {
            for (var i=0; i<records.length; i++) {
                var r = records[i];
                if (r.type!="childList" || !r.addedNodes || !r.addedNodes.length) { continue; }
                var added = r.addedNodes;
                for (var j=0; j<added.length; j++) {
                    domnodeinserted(added[j]);
                }
            }
        };
        X(function() {
            new MutationObserver(_observer).observe(document.body, { childList: true, subtree: true });
        });
    } else {
        X(document).on('DOMNodeInserted',function(e) {
            domnodeinserted(e.target);
        });
    }

    // Return the API
    // ==============
    return fx;
})();

// Main Source
// ===========
var version = "15.1.0";
var global_options = {
	"use_mutation_observers":true
};
var global = {};

// Stop running under certain conditions
// =====================================
if (window.top != window.self) { throw "Social Fixer not running in frames"; } // no frames
if (/\/l.php\?u|\/ai.php|\/plugins\/|morestories\.php/.test(location.href)) { throw "Social Fixer not running for url "+location.href; }

var runat = X.is_document_ready()?"document-end":"document-start";

// For Vue Templates
// =============================
function template(appendTo,template,data,methods,computed,events) {
	var frag = document.createDocumentFragment();
	var ready = function(){};
	var v = new Vue(X.extend({
		"el":frag
		,"template":template
		,"data":data
		,"methods":methods
		,"computed":computed
		,"replace":false
		,"ready":function() { ready(); }
	},events));
	if (appendTo) {
		v.$appendTo(appendTo); // Content has already been sanitized
	}
	var o = {
		"$view":v,
		"fragment":frag,
		"ready": function(func) {
			if (v._isReady) { func(); }
			else { ready=func; }
			return o;
		}
	};
	return o;
}

// Find out who we are
// ===================
userid = X.cookie.get('c_user') || "anonymous";
// Prefix stored pref keys with userid so multiple FB users in the same browser can have separate prefs
X.storage.prefix = userid;

// Feature Modules
// ===============
// =========================================================
// Popup Notifications in a new window
// =========================================================
FX.add_option('notification_popup',{"section":"Experiments","title":'Notification Popup',"description":"Add a link in the Notifications dropdown header to pop up Notifications in a new window.","default":true});
FX.add_option('notification_popup_auto_refresh',{"section":"Experiments","title":'Notification Popup',"description":"Automatically refresh the notification popup window when new notifications arrive.","default":true});
FX.add_option('notification_popup_new_tab',{"hidden":true,"title":'Notification Popup',"description":"Open notifications in a new tab instead of the opener","default":false});
FX.add_option('notification_popup_group',{"hidden":true,"title":'Notification Popup',"description":"Group Notifications on the same post together","default":true});

FX.on_options_load(function() {
    if (!FX.option('notification_popup')) { return; }

    var notif_window = null;
    X.when('#fbNotificationsFlyout .uiHeaderActions', function($actions) {
        var $link = X(`<a style="margin-right:10px;" data-hover="tooltip" data-tooltip-content="Open a Notifications Dashboard in a new window. (Social Fixer)")>Open In Popup</a>`);
        $link.click(function(e) {
            try { notif_window.focus(); }
            catch (e) {
                var h = 500;
                try { h=window.outerHeight; } catch(e){}
                notif_window = window.open('/notifications?sfx_notification_popup=true', 'SFX_NOTIFICATIONS', `width=480,height=${h},top=0,left=0`);
            }
            return false;
        });
        $actions.prepend($link);
    });

    // Capture clicks in the notification popup window
    if (/sfx_notification_popup=true/.test(location.href)) {
        FX.add_html_class('sfx_notification_popup');
        var notif_context = {};
        if (FX.option('notification_popup_group')) {
            FX.on_content(function ($c) {
                var selector = 'li[data-gt]:not(.sfx_notification)';
                var $li = ($c.is(selector)) ? $c : $c.find(selector);
                $li.forEach(function (li) {
                    try {
                        var $li = X(li);
                        var id = JSON.parse($li.attr('data-gt')).content_id;
                        if (!id) {
                            return;
                        }
                        if (typeof notif_context[id] == "undefined") {
                            // This is the first notif for this context, leave it
                            notif_context[id] = $li;
                            $li.addClass("sfx_notification");
                        }
                        else {
                            // Move this li up to be under the first one
                            notif_context[id].after(li);
                            $li.addClass("sfx_sub_notification");
                            $li.addClass("sfx_notification");
                        }
                    } catch (e) {
                    }
                })
            });
        }
        FX.on_content_loaded(function() {
            X.bind('#content','click',function(e) {
                var $a = X.target(e,true).closest('a');
                if ($a.attr('role')=="button") { return; }
                var href = $a.attr('href');
                var target = null;
                if (href && href!="" && href!="#") {
                    e.stopPropagation();
                    e.preventDefault();
                    try {
                        if (!target) {
                            target = window.opener;
                        }
                        if (FX.option('notification_popup_new_tab')) {
                            target.open(href);
                        }
                        else {
                            target.location.href = href;
                        }
                        target.focus();
                    }
                    catch (e) {
                        target = window.open(href);
                    }
                    X('.sfx_notification_selected').removeClass('sfx_notification_selected');
                    $a.closest('li').addClass('sfx_notification_selected');
                }
                return true;
            },true);
            // Add a place for SFX controls
            var data = {
                "count":null,
                "new_tab":FX.option('notification_popup_new_tab'),
                "group":FX.option('notification_popup_group')
            };
            var actions = {
                "refresh": function() { window.location.reload(); }
                ,"mark_all_read":function() {
                    var $a = X('#fbNotificationsJewelHeader ~ * > a[role="button"]');
                    X.ui.click($a,false);
                }
                ,"toggle_new_tab":function() {
                    FX.option('notification_popup_new_tab',!FX.option('notification_popup_new_tab'),true);
                }
                ,"toggle_group":function() {
                    FX.option('notification_popup_group',!FX.option('notification_popup_group'),true, this.refresh);
                }
            };

            var html = `
                <div id="sfx_notification_popup_header">
                    <div id="sfx_notification_popup_header_actions">
                        <span class="sfx_link" @click.capture.prevent.stop="mark_all_read">Mark All Read</span>
                        <span>
                            <input type="checkbox" v-model="new_tab" @click="toggle_new_tab"> Open links in new tab/window
                        </span>
                        <span>
                            <input type="checkbox" v-model="group" @click="toggle_group"> Group Notifications
                        </span>
                    </div> 
                    <div v-if="count>0">{{count}} new notification{{count>1?"s":""}}. <a href="#" @click.prevent="refresh">Refresh</a>.</div>
                </div>
            `;
            var $t = template(null,html,data,actions);
            X('#globalContainer').before($t.fragment);
            // Check for new notifications and alert
            setInterval(function() {
                var count = X('#notificationsCountValue').text();
                if (count && data.count==null) {
                    data.count=count;
                }
                else if (count && +count>0 && +count>data.count) {
                    if (FX.option('notification_popup_auto_refresh')) {
                        window.location.reload();
                    }
                    data.count = +count;
                }
            },2000);
        })
    }
});

// ========================================================
// Anonymize Screens
// ========================================================
(function() {
	// Add a menu item
	var item = {"html":"Anonymize Screen","message":"menu/anonymize", "tooltip":"Anonymize the current screen to make it suitable for screenshots to be shared without showing friends' names"};
	X.publish('menu/add',{"section":"actions", "item":item});
	
	// This function gets fired when the menu item is clicked
	X.subscribe("menu/anonymize",function() {
		var namehash = {};
		var colorhash = {};
		var colorcount = 1;
		var namecount = 1;
		var grouphash = {};
		var groupcount = 1;
		var eventhash = {};
		var eventcount = 1;
		var anon_names = ["Mario Speedwagon","Anna Sthesia","Paul Molive","Anna Mull","Paige Turner","Bob Frapples","Walter Melon","Nick R. Bocker","Barb Ackue","Buck Kinnear","Greta Life","Ira Membrit","Shonda Leer","Brock Lee","Maya Didas","Rick O'Shea","Pete Sariya","Sal Monella","Sue Vaneer","Cliff Hanger","Barb Dwyer","Terry Aki","Cory Ander","Robin Banks","Jimmy Changa","Barry Wine","Wilma Mumduya","Zack Lee","Don Stairs","Peter Pants","Hal Appeno ","Otto Matic","Tom Foolery","Al Dente","Holly Graham","Frank N. Stein","Barry Cade","Phil Anthropist ","Marvin Gardens","Phil Harmonic ","Arty Ficial","Will Power","Juan Annatoo","Curt N. Call","Max Emum","Minnie Mum","Bill Yerds","Matt Innae","Polly Science","Tara Misu","Gerry Atric","Kerry Oaky","Mary Christmas","Dan Druff","Jim Nasium","Ella Vator","Sal Vidge","Bart Ender","Artie Choke","Hans Olo","Marge Arin","Hugh Briss","Gene Poole","Ty Tanic","Lynn Guini","Claire Voyant","Marty Graw","Olive Yu","Gene Jacket","Tom Atoe","Doug Out","Beau Tie","Serj Protector","Marcus Down","Warren Peace","Bud Jet","Barney Cull","Marion Gaze","Ed Itorial","Rick Shaw","Ben Effit","Kat E. Gory","Justin Case","Aaron Ottix","Ty Ballgame","Barry Cuda","John Withawind","Joe Thyme","Mary Goround","Marge Arita","Frank Senbeans","Bill Dabear","Ray Zindaroof","Adam Zapple","Matt Schtick","Sue Shee","Chris P. Bacon","Doug Lee Duckling","Sil Antro","Cal Orie","Sara Bellum","Al Acart","Marv Ellis","Evan Shlee","Terry Bull","Mort Ission","Ken Tucky","Louis Ville","Fred Attchini","Al Fredo","Reed Iculous","Chip Zinsalsa","Matt Uhrafact","Mike Roscope","Lou Sinclark","Faye Daway","Tom Ollie","Sam Buca","Phil Anderer","Sam Owen","Mary Achi","Curtis E. Flush","Holland Oats","Eddy Kitt","Al Toesacks","Elle Bowdrop","Anna Lytics","Sara Bellum","Phil Erup","Mary Nara","Vic Tory","Bobby Pin","Juan Soponatime","Dante Sinferno","Faye Sbook","Carrie R. Pigeon","Ty Pryder","Cole Slaw","Luke Warm","Travis Tee","Clara Fication","Paul Itician","Deb Utant","Moe Thegrass","Carol Sell","Scott Schtape","Cody Pendant","Frank Furter","Barry Dalive","Mort Adella","Ray Diation","Mack Adamia","Farrah Moan","Theo Retical","Eda Torial","Tucker Doubt","Cara Larm","Abel Body","Sal Ami","Colin Derr","Mark Key","Sven Gineer","Benny Ficial","Reggie Stration","Lou Ow","Lou Tenant","Nick Knack","Patty Whack","Dan Delion","Terry Torial","Indy Nile","Ray Volver","Minnie Strone","Gustav Wind","Vinny Gret","Joyce Tick","Cliff Diver","Earl E. Riser","Cooke Edoh","Jen Youfelct","Reanne Carnation","Gio Metric","Claire Innet","Marsha Mello"];
		// Randomize the anon_names array
		for (var i = anon_names.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = anon_names[i]; anon_names[i] = anon_names[j]; anon_names[j] = temp;
		}
		X.QSA(`.uiProfilePhoto,
		        .profilePic,
		        img.bfb_friend_activity_img,
		        .UIImageBlock_MED_Image img,
		        #navAccountPic img,
		        a.UIImageBlock_ENT_Image img,
		        .smallPic .img,
		        .fbChatOrderedList .pic,
		        img[src*=fbcdn-profile-],
		        .UFIActorImage,
		        img.tickerStoryImage,
                a[data-hovercard*="user.php"] img,
                a[data-hovercard*="page.php"] img`,function(i) {
			if (i.parentNode && i.parentNode.href && i.parentNode.href.indexOf("photo.php")>=0) { return; } // photo, not profile pic
			if (i.src && i.src.indexOf("external.ak.fbcdn")>=0) { return; } // External img
			if (i.parentNode && X(i.parentNode).hasClass('UIImageBlock_MED_Image')) {
				i.src="data:image/gif;base64,R0lGODlhMgAyAMQAAPP1%2Bdzh7eXp8tHY58jR4s3V5O7x9vn6%2FOru9NTa6Pz9%2Funs8%2Fb4%2BvX2%2Bv7%2B%2F%2Fb3%2Btrg7MvT5MfQ4vj5%2B9fd6t7k7uPn8MbO4czT5PHz%2BNXc6dbc6dLZ6MbP4f%2F%2F%2F8TN4CH5BAAAAAAALAAAAAAyADIAAAX%2FYCeOZGmeaKqubJt%2BcCzPdG3feK7vfF8PFcMk4ivaCIGMZ%2BkJGJ8xDYBJHUCNmAd164FcexWuGPHVLcToR%2FkmQLvV61nETffGY206unGPKfViDn0wDIBogx8HhmIdg4qLWxeDE5BbjX1alUyIU5pLiH%2BaCohnnhODBY%2BeG32lnh5wcRCvSwt9A7RNfRK5HIO5RH2znraIrwSIH6GLgskBmgbJHxeaCdIfBpCj1x%2BQVtzLdNwwnYDjiYuX15AY3LyLGtcEmvHJGpoC0nmQfMkKnsHidLCQC0FAKBgQ5KKSwZeRDeUWUjngZIcEC%2F8k0lnQzsaAbBoXNaAwgwKlkKIqA3wIAQA7";
			}
			else {
				i.src="data:image/gif;base64,R0lGODlh1ACuAPcAALjB2f%2F%2F%2F%2BPm8Njc6dTY58LJ3sDI3vL09%2B7w9dDW5dDV5cbM38PDw5KSkra%2F2LfA2LfA2bW%2F2LS%2B17W%2B17bA2LfB2f7%2B%2Fvz8%2Ff39%2FrvD2rS917W%2B2LW%2F177G3Ofp8fr6%2FLrC2tba6MTL3%2FLy99HW5sfO4b3F2%2Bbo8fv7%2FbnB2e3t7c3T5MLJ3cXM39PY57bA2b%2FG3LO81urs8%2Bzu9N3g7ODj7sHI3e%2Fw9tnd6szR4ra%2F1%2FHy9%2BLl78DH3fX2%2Btzf67vE29PX5unr8ufq8rzE28bN4PT1%2BcvR4uTn8Orr88DH3Ojq8vX2%2Bfj4%2Bvn5%2B7jB2N3h7N7h7Nzg7P79%2FtXa6Pf4%2B%2FP0%2BM3S4%2BXo8brC2fv7%2FOzt9NDV5sPK3vLz9%2F%2F%2B%2F8fN4Pb3%2BsXN4LvE2t%2Fi7bnC2ubp8fPz%2BMXL3%2BHl77O91vz7%2FeXo8Onr8%2BPm78DI3bO%2B1%2B3v9bzE2tfb6MnP4s7T5PT1%2BOLk7uHk7tLX57O91%2B7w9uvt88jO4e7v9djc6r3F3LjA2dvb29PY5s3T49%2Fj7tzg68vR48bM4KysrPDy9vPz9%2BDk7sHJ3dLX5vb2%2Btne6vf4%2Bs%2FV5dre6tre67nC2eDj7fHx9ubo8Ovt9Nvf69HX5ujr8vj5%2B%2F38%2Ff3%2B%2FszR47K81snO4fP1%2BdXa58jO4Ojq8fDx97rD2rvC2v7%2B%2F77F3M7T47zD2vr6%2B7vD2drd6rS%2B1r7G27K81bvD28nQ4b%2FH3PLy9tfc6ejq8%2F%2F%2F%2Fr%2FH3fj4%2B%2Fb2%2Bb3E29ba6dbb6Nbb6dTZ6NHV5uzt9eTm7%2F39%2Fff3%2Bu3u9O3u9b7F28bN4cfN4be%2F2PT0%2BPT0%2BfLx9%2FDy98vS4%2Fn6%2FOLk7%2Fn6%2B%2BHk7%2Fz8%2FsDI3PHz99LW5uHk7ff3%2B%2Bfq8fn4%2B8rQ4srQ4%2BPl77S%2B2MHH3u%2Fx9%2Bvs8%2BTm8OXn8PX1%2BOXn8f7%2F%2F8jP4MjP4fb4%2Bu7v9vL0%2BPv8%2FbS%2F2MzS4%2Bjp8fX3%2Bt7i7d%2Fj7fDx9s%2FU5M%2FU5cfO4Ors9PLz%2BLa%2B18LK3ubo8iH5BAAAAAAALAAAAADUAK4AAAj%2FABkEGEiwoMGDCBMqXMiwocOHECNKnEixIgOBFTNq3Mixo8ePGS%2BCHEmypMmTH0WiXMmypcuRKl%2FKnEmzJsGYNnPq3NkR50AAQIMKHUq0qNGjSJMqXcq0qdOnUKMaPegzgNSrWLNq3cq1K1KqGAt6HUu2rNmzTcEeRMu2rdu3UNUahEu3rt22csXe3cu3b9S8BP0KHkxYKOCfhRMrrnvY6uLHkM02jky5stbJljNrZop5s%2BfPhg1WBX0XAgUHDh6Qftp5NVoKESRISGFCSQ9ArtOKDhs491gHEyKoRqNA05AZO%2Bw8IqPad9LWzq9S0OMARh8qZrhd%2BGJwR4Hm0afu%2F14bHirsDRW6UMFyZqGXDhzKH4Uu%2FygECRxMlKCh6EPDNSVIUJ94BY02oFEVOCBBFnWksUhEbkxwYFH0TSgBBY388I4FE2ExAQQTDlVhfaiVIMAFGX0gjwYhhlYgb4hN6IAOIpiDAkfVHKEBiC2OGJ0Eq9iDwUcXCKMDeAf6mFsEDkhiBUkWuOGLgBMquVoEJiCB0ilFSJjkeHOVB8EEzIzAUickOEDBgFZ6BoEDBKDYkgVQALCmfG1q9oIDUnAo0wljRIAnmHr55gAIWtbkBwyChpdnZRRkMY9OlyjRqHOPRgbBA%2BnwdAMRL0SXKWQR4MDTQOcAwGNuoy7mwAJy8v9kgSMbYEpob6tRwMmpBFkBRAW%2BtZoYB4jAwytBJHjpmrCFaUDJsQRl4kCwt8b42QMgzADtQI%2FYMO2y1ToGmgM2uLJtAFNIQ%2BVqzA4WQS3nDvTHuqS1K1gE2sQbQA3fshvuag78oK8HqoL7InnjWqJvHCCsCpq9fjnggb4jZIDkZxD3JbG%2B0Fhs8E0wivvZxvE6Q8vFnmXMlwMy6GtBByhvpvJeFNCjbwAwfzyQgaBRUMXNOft7cJjjJuFy0PX%2BS5oDJ%2BiLDhAxazbzXSSfW3HUmU1tV9XbXq1zADyPPHG8XgsNMsIjY6LvIh6bvXPIAEOhbzmVOIyx0uMKHO8JBbv%2FDTbcS%2Bt9LsF2p4z3yCHoWwwAwPodtmcRcKEvDf0mPXShn0UwzOSVP3w45CvoG0Xnd1%2BOa%2BZi6BsCvZ6bbi3kqcebhxqsfq4ZBXDEfq4Ls5Aus%2B2WQfAGGZfoa0QNLYRq%2BdlEbwYBGzcT1EbfpTOPuWYQtBx9AFukUnjWwFfmgMLb8%2B044J45YOr2hdS6%2FNtoaxaP5NsHE8P58Wc2QQnbT1EH679zncg0E4ECNCF6HwCD%2B1pnvdPdThm3iJ4PeoC1ymgNLg%2BoxD6ix48yVJAyF4TLBBKlr0zo4WuP04wannUzMiiLgfBr3mYmEITozeFSMPxb%2FjLjAFAY42YEwGH1%2F2J4PT2x4Ebx%2BgIimoFC9I1MCPryQxm%2BJ7XwWcYBLWDCucLQhwW%2BT4cydFMHfAAtDIjAd4YTYG5iwANo3QACVAxgA183sjxAixEfBJ8aXeOALnziWMmy1R5X8wAgKIJXH0CDF%2FEXRs8kqI2n2kPbajfI1WjAEao4FSPgICorasYBLPjZTnRxBSEysoigeYC2dhKJDDjKk5oRxx94ggRTntKBS2PBkHRyhRdSco4DJE0FIADFnBihA3cSJDCjowEu%2BKkmUfDlL4mIS9K8AAQ7sMkaWIDGL6ZwNRJIgE1osEhqVdI3FPgHTXYAhGR28py5ccAbeiGTC9ABgOZcZnliUf8ImSCjH40rTwj9EoF8PJMlk7BlPqlJxyXlYJctoYJCpwlGVLomAg99SQgm2sQdXjSjLtkom2CZOZC2RKT1GWhfJuACmWxDmspkaDBzIwFcyIQNMF1oRavpmhikQSbkwKdOv%2BmaCYzNJaPIwhNSSlLnlYEYMjmGEtz5Tn1GpzpekEkCOepNJ%2FqmgAd8CQauINSONhKcRYiVS1wQCqbCczWByAAkaGIGE7jVqq6BAAiS8IGDvuQaN%2FBHN4e404aOTAQ8IUE5b2nY9LGCJ4YYbBrxupoJrE8nHqCqWS3qGQnkgie8SMEr3%2BrIDByAJxfoQhwnK9OvFsE%2FO1HHMMrK2sL%2FztQzGiAFr7AQn5jaNjeq0R5PmNADyeqRsp%2FRgAggypMgxCCgjL0tpAQkijhAKxKSyMAEjBsZlaLlPmNYwRaYeywvuKADF%2BqqRxeToAkQwQV72F4A7ACJcXAgAqtdjHfHsl0bwIKM8iWIN%2B7QggrQVjH73coDNuCAUuDBCQFGyBS6QYgnpNeCTaWaBDKwgjZoIcILsUA0BgGICfQWMgmOyps0YIM5mAnEDwmDIdBw3%2FzuJcVOocAEnqCPGoQBxhNxwhKOAILtIjjDbHmABORAgmICOSM3AAY2JqBZvuAYKQ%2BgMgugkI0ne4QJ1ABDlrnLlisX5QEaeMUhMKFWL3cE%2FwNb2IQsNFBluJg5KA%2BIgA5ggAMEuBklVqjHGal8lzvfJwUl4AGE%2F8wSFJhiBa24sJ2RfJUESYAIQeCDXxnNkhsMwBYScICNuZJiDjjAAJN4Eqdt0o4aiOA%2B0JUMpZ0CgSO14A7TWDVPPHGCbwDgQ2hR6QQeUIIhwFbXp7rADFbw61H%2FZdZK0TE7TrBpZJ%2BKD%2FgIBJlZA%2B2jZHkX1viwtV2WhBYQ2itTc0AKhCHKcUfvAlGQw2KvMjMJ9GAJ7gbxPdYB7K2obAKHAHC%2BI3yBEIja390WigRI0OaBB1gKEYj1s0nLlIWT1%2BERlgIF8vichP%2BaDkjE%2BJNXl5V2UaADz%2FsQuZtRsIwTTxy5THEAJFXuZXc0jN7djkARLk7zCH9hEAf%2BSs6H0PM%2Fn2EMziaKsB7QCHEX3cuE2LaIoK2Byz79yWYIOoFgjuUUCPfqQDaCCerccYobxQGNCCvYYayCAFzgCFqfutmLMgFwrP3JbQ8ADljE7bkTxQG%2FuDuQ8x6OB0i87Fw%2FigPwIHi2DyQZqEg6UFr1AHw3PsJ5P4MJOO4iYF7%2B8xCpCuhHzxDRk%2F70jUG96j2%2FetWbvvWnZ0AiGkD72tv%2B9rjPve53z%2Fve%2B%2F73wA%2B%2B8IdP%2FOIbPxGCuIjyl8%2F85jv%2F%2BdCPvvSnT%2F3qW%2F%2F62M%2B%2B9rfPAEEEBAA7";
			}
		});
		X.QSA('#navAccountName,#navTimeline a',function(o) {
			if (X(o,'img')){return;}
			var c=o.innerHTML;
			if (o.href) { 
				if (o.href.indexOf("?")>-1) {
					if (/profile.php/.test(o.href)) {
						c = o.href.replace(/(profile.php[^\&]+).*/,"$1");
					}
					else {
						c = o.href.substring(0,o.href.indexOf("?")); 
					}
				}
				else {
					c=o.href;
				}
			}
			if (!namehash[c]) { colorhash[c]=colorcount++; if(colorcount>24) { colorcount=1; } namehash[c] = "Me"; }
			X(o).text(namehash[c]).addClass('sfx_anonymous sfx_anonymous_'+colorhash[c]);
		});
		X.QSA('.UFIReplySocialSentenceLinkText,.actorName a,a.actorName,a.ego_title,span.blueName,a.passiveName,.fbxWelcomeBoxName,*[data-hovercard*="user"],*[data-hovercard*="page"],*[data-hovercard*="group"],a[href*="/profile.php"],.headerTinymanName,.UFICommentActorName,.UFILikeSentence a[href^="http"],‪#‎navTimeline‬ a,.tickerFeedMessage .passiveName, a.profileLink, ‪#‎friends_reminders_link‬ .fbRemindersTitle strong',function(o) {
			if (X(o).find('img').length>0 || X(o).hasClass('sfx_anonymous')){return;}
			var c=o.innerHTML;
			if (o.href) { 
				if (o.href.indexOf("?")>-1) {
					if (/profile.php/.test(o.href)) {
						c = o.href.replace(/(profile.php[^\&]+).*/,"$1");
					}
					else {
						c = o.href.substring(0,o.href.indexOf("?")); 
					}
				}
				else {
					c=o.href;
				}
			}
			if (!namehash[c]) { colorhash[c]=colorcount++; if(colorcount>24) { colorcount=1; } namehash[c] = anon_names[namecount++ % anon_names.length]; }
			X(o).text(namehash[c]).addClass('sfx_anonymous sfx_anonymous_'+colorhash[c]);
		});
		X.QSA('#groupSideNav .linkWrap',function(o) {
			var c = o.innerHTML;
			if (!grouphash[c]) { grouphash[c] = "Group #"+(groupcount++); }
			X(o).text(grouphash[c]);
		});
		// Try to anonymize names in the ticker that are not friends
		X.QSA('.tickerFeedMessage .fwb',function(token) {
			try {
				if (token.nextSibling.nodeType==3) {
					token.textContent = "another user";
				}
			}
			catch (e) { }
		});
		X.QSA('.tickerFeedMessage',function(msg) {
			try {
				if (/ (on|likes) [^']+'s /.test(msg.innerHTML)) {
					msg.innerHTML = msg.innerHTML.replace(/ (on|likes) [^']+'s /,' $1 someone\'s ');
				}
			}
			catch (e) { }
		});
        X.QSA('.tickerFeedMessage',function(msg) {
            try {
                if (/posted in/.test(msg.innerHTML)) {
                    msg.innerHTML = msg.innerHTML.replace(/posted in [^\.]+/,'posted');
                }
            }
            catch (e) { }
        });
		// Anonymize Friend lists
		X.QSA('#listsNav .linkWrap, #pinnedNav li[data-type="type_friend_list"] .linkWrap',function(o) { X(o).text('Friend List'); });
		// Anonymize Pages
		X.QSA('#pagesNav .linkWrap, #pinnedNav li[data-type="type_page"] .linkWrap',function(o) { X(o).text('Page'); });
		// Anonymize Groups
		X.QSA('#groupsNav .linkWrap, #pinnedNav li[data-type="type_group"] .linkWrap',function(o) { X(o).text('Group'); });
		// Events
		X.QSA('#pagelet_reminders #event_reminders_link .fbRemindersTitle, #eventsNav .linkWrap',function(o) { X(o).text('Event'); });
	});
})();

// =============================================
// "Bubble" Notes are panels to display... notes
// =============================================
function bubble_note(content,options) {
    options = options || {};
    options.position = options.position || "top_right";
    if (typeof options.close!="boolean") { options.close=false; }
    options.id = options.id||"";
    if (typeof options.draggable!="boolean") { options.draggable=true; }
    // If ID is passed, remove old one if it exists
    if (options.id) {
        X('#'+options.id).remove();
    }

    // Bubble note content is generated entirely from within code and is untainted - safe
    var c = X(`<div id="${options.id}" style="${options.style}" class="sfx_bubble_note sfx_bubble_note_${options.position} ${options.className}"></div>`);
    if (options.close) {
        c.append(`<div class="sfx_sticky_note_close"></div>`);
    }
    if (options.title) {
        c.append(`<div class="sfx_bubble_note_title">${options.title}</div>`);
    }
    if (typeof content=="string") {
        c.append(`<div class="sfx_bubble_note_content">${content}</div>`);
    }
    else {
        c.append(content);
    }
    // Close functionality
    c.find('.sfx_sticky_note_close, .sfx_button_close').click(function() {
        if (typeof options.callback=="function") {
            options.callback(c);
        }
        c.remove();
    });

    X(document.body).append(c);
    if (options.draggable) {
        X.draggable(c[0]);
    }
    return c;
}

// A popup that remembers not to show itself next time
function context_message(key,content,options) {
    options = options || {};
    X.storage.get('messages',{},function(messages) {
        if (typeof messages[key]=="undefined") {
            // Show the message
            // Add an option to now show the message in the future
            content += `
                <div style="margin:15px 0 15px 0;"><input type="checkbox" class="sfx_dont_show" checked> Don't show this message again</div>
                <div><input type="button" class="sfx_button sfx_button_close" value="OK, Got It"></div>
            `;
            options.close = true;
            options.id = "sfx_content_message_"+key;
            options.title = `<div class="sfx_info_icon">i</div>${options.title}`;
            options.style="padding-left:35px;";
            options.callback = function($popup) {
                if ($popup.find('.sfx_dont_show').prop('checked')) {
                    X.storage.set('messages',key,X.now(),function() {});
                }
            };
            return bubble_note(content,options);
        }
    },true);
}
// Insert a control to expand and highlight comments
X.publish('post/action/add',{"section":"wrench","label":"Add Comment Navigator","message":"post/action/commentnavigator/add"});
X.subscribe('post/action/commentnavigator/add', function(msg,data) {
    var dom_id = data.id;
    var sfx_id = data.sfx_id;
    var $post = X(document.getElementById(dom_id));

    var expander_selector = '.UFICommentLink:not(.sfx_clicked), .UFIPagerLink:not(.sfx_clicked)';
    var post_time = ($post.find('abbr[data-utime]').first().attr('data-utime')||0) * 1000;
    var now = X.now();

    var data = {
        "post_time":post_time
        ,"now":now
        ,"max":(now-post_time)
        ,"range":0
        ,"show_expand_all":true
        ,"limit":25
    };
    var expanders = function() {
        return $post.find(expander_selector).filter(function() {
            var $e = X(this);
            return (!$.find('*[aria-busy]').length && !$e.find('.UFICollapseIcon').length);
        });
    };
    var methods = {
        "expand": function() {
            var self = this;
            var limit = data.limit;
            var expand_all = function() {
                self.show_expand_all = expanders().length;
                var clicked =false;
                expanders().each(function(i,o) {
                    try {
                        var $o = X(o);
                        $o.addClass('sfx_clicked');
                        // If it has an href, make sure we don't follow it!
                        if ($o.attr('href') == '#') {
                            o.onclick = X.return_false;
                        }
                        $o.css('background-color','yellow');
                        X.ui.click($o);
                        clicked = true;
                        limit--;
                        if (limit > 0) {
                            setTimeout(function () {
                                expand_all();
                            }, 400);
                        }
                        console.log("calling again");
                        return false; // Only click the first one
                    } catch (e) {
                        alert(e);
                    }
                });
                if (!clicked) {
                    self.show_expand_all = false;
                }
            };
            expand_all();
        }
        ,"mouseover": function() {

        }
        ,"change": function() {
            var now = this.now;
            var range = this.range;
            $post.find('form abbr[data-utime]').each(function(i,o) {
                var $o = X(o);
                var ut = (+$o.attr('data-utime')||0)*1000;
                if (!ut) { return; }
                if (ut > now-range) {
                    $o.css('background-color','yellow');
                }
                else {
                    $o.css('background-color','');
//                    $o.closest('.UFIComment').css('outline','');
                }
            })

        }
        ,"ago": function() {
            return X.ago( now-this.range,now,true,true);
        }
    };
    var html = `<div style="border:1px solid #E1E2E3;padding:10px;">
            <div v-if="show_expand_all" class="sfx_link" style="float:right;" @click="expand">Expand <span v-if="(show_expand_all>limit)">{{limit}} of </span><span v-else>All </span>{{show_expand_all}} Hidden Comments</div>
            <div>Highlight comments newer than: <b>{{ago()}}</b></div>
            <div><input v-model="range" type="range" min="0" max="{{max}}" style="width:95%;" @v-bind:mouseover="mouseover" @change="change"></div>
        </div>`;
    var $vue = template(null, html, data, methods);
    $post.find('form .UFIList h6.accessible_elem').after($vue.fragment);
    data.show_expand_all = expanders().length;
});

// =====================================
// Post Filter: Move/Copy To Tab
// =====================================
FX.add_option('control_panel_x', {"hidden":true,"default":0} );
FX.add_option('control_panel_y', {"hidden":true,"default":50} );
FX.add_option('control_panel_right', {"hidden":true,"default":false} );
FX.add_option('control_panel_bottom', {"hidden":true,"default":false} );
FX.add_option('reset_control_panel_position',{"title":'Reset Control Panel Position',"section":"Advanced","description":"Reset the position of the Control Panel to the upper left","type":"action","action_text":"Reset Position","action_message":"cp/reset_position"});

var $vm, data;
var reset = function() {
    X('#sfx_control_panel').remove();
    data = {
        "sections":[]
    };
    control_panel_created = false;
};
reset();

// Reset the position
X.subscribe("cp/reset_position", function() {
    FX.option('control_panel_x', null, false);
    FX.option('control_panel_y', null, false);
    FX.option('control_panel_right', null, false);
    FX.option('control_panel_bottom', null, false);
    X.storage.save("options");
    position_control_panel(null,null,false);
});

// Add a SECTION
X.subscribe("cp/section/add", function(msg,section_data) {
    create_control_panel();
    section_data.order = section_data.order || 999;
    // {"name", "id", "help", "order"}
    data.sections.push(section_data);
});

var control_panel_created = false;
var create_control_panel = function() {
    if (control_panel_created || X.find('#sfx_control_panel')) { return; }
    control_panel_created = true;

    var html = `<div id="sfx_control_panel">
            <div class="sfx_cp_header"><span style="float:right;" v-tooltip="{icon:true,content:'The Social Fixer Control Panel is where tabs appear from filters you have defined and other controls may appear, depending on options selected.\n\nTo hide it completely, disable the options that require it (tab filters, mark all read, etc)'}"></span>Social Fixer</div>
            <div class="sfx_cp_data">
                <div class="sfx_cp_section" v-for="section in sections | orderBy 'order'">
                    <div class="sfx_cp_section_label" v-tooltip="{content:section.help,position:'right',delay:300}">{{{section.name}}}</div>
                    <div class="sfx_cp_section_content" id="{{section.id}}"></div>
                </div>
            </div>
        </div>
        `;
    var v = template(document.body, html, data).ready(function() {
        // Position it
        position_control_panel(null,null,false);

        // Make it draggable
        X.draggable('#sfx_control_panel',function(el,x,y) {
            position_control_panel(x,y,true);
        });
    });
    $vm = v.$view; // The Vue instance, to access the $set method
};
var position_control_panel = function(x,y,save) {
    var $cp = X('#sfx_control_panel');
    if (!$cp.length) { return; }
    var right = FX.option('control_panel_right');
    var bottom = FX.option('control_panel_bottom');
    var snap_tolerance = 15;
    var reposition = false;
    if (typeof x=="undefined" || x==null || typeof y=="undefined" || y==null) {
        // Re-position it with saved options
        x = +FX.option('control_panel_x');
        y = +FX.option('control_panel_y');
        reposition = true;
    }
    var h = $cp[0].offsetHeight;
    var w = $cp[0].offsetWidth;

    // Constrain it to the screen
    if (x<1) { x=1; }
    if (!reposition) {
        right = (window.innerWidth && x + w > (window.innerWidth - snap_tolerance)); // Off the right side, snap it to the right
    }
    if (y < 40) { y=40; }
    if (!reposition) {
        bottom = (window.innerHeight && y + h > (window.innerHeight - snap_tolerance)); // Off the bottom, snap to bottom
    }

    // Position it
    if (right) {
        $cp.css({'right':0,'left':''});
    }
    else {
        $cp.css({'left':x,'right':''});
    }
    if (bottom) {
        $cp.css({'bottom':0,'top':''});
    }
    else {
        $cp.css({'top':y,'bottom':''});
    }

    // Persist the control panel location
    if (false!==save) {
        FX.option('control_panel_x', x, false);
        FX.option('control_panel_y', y, false);
        FX.option('control_panel_right', right, false);
        FX.option('control_panel_bottom', bottom, false);
        X.storage.save("options");
    }
};
// On window resize, make sure control panel is on the screen
X(window).resize(function() {
    position_control_panel();
});
FX.on_options_load(function() {
    if (FX.option('always_show_control_panel')) {
        FX.on_page_load(function() {
            create_control_panel();
        });
    }
});

// If options are updated from another tab, move the control panel
X.subscribe("storage/refresh", function(msg,data) {
    if ("options"==data.key) {
        position_control_panel(null,null,false);
    }
});

// When the page unloads to navigate, remove the control panel
FX.on_page_unload(reset);

FX.add_option('disable_tooltips',{"title":'Disable Tooltips',"section":"Advanced","description":"If you are an Advanced user and no longer need to see the helpful tooltips that pop up when hovering over some things, you can entirely disable them here.","default":false});

FX.on_options_load(function() {
    if (FX.option('disable_tooltips')) {
        Vue.directive('tooltip', function (o) {} );
    }
});

// ========================================================
// Display Tweaks
// ========================================================
FX.add_option('tweaks_enabled', {
	"section":"Display Tweaks"
	,"hidden":true
	,"default":true
});
FX.on_options_load(function() {
	var tweaks = FX.storage('tweaks');
	if (!tweaks || !tweaks.length || !FX.option('tweaks_enabled')) { return; }
	for (var i=0; i<tweaks.length; i++) {
		if (tweaks[i].enabled && !tweaks[i].disabled) {
			X.css(tweaks[i].css,'sfx_tweak_style_'+i);
		}
	}
});

FX.add_option('sfx_option_show_donate2',
    {
        "section": "Advanced"
        , "title": 'Show Donate Message'
        , "description": 'Show a reminder every so often to support Social Fixer development through donations.'
        , "default": true
    }
);
FX.on_options_load(function() {
    // Before showing the donate message, wait at least 5 days after install to not annoy people
    X.storage.get('stats',{},function(stats) {
        if (stats && stats.installed_on && (X.now()-stats.installed_on > 5*X.days) && userid!="anonymous") {
            X.task('sfx_option_show_donate',30*X.days, function() {
                if (FX.option('sfx_option_show_donate2')) {
                    X.when('#sfx_badge', function() {
                        X.publish("menu/options", {"section": "Donate", "data": { "sfx_option_show_donate": true} });
                    });
                }
            });
        }
    },true);
});

// =========================================================
// External CSS
// =========================================================
FX.add_option('external_css_url',{"section":"Advanced","type":"text","title":'External CSS url',"description":'Enter a full HTTPS url for external css to be included in the page. This will create a css LINK element in the page pointing to the css file.\nThe file must be hosted on an HTTPS server or your browser may block its content.',"default":""});
FX.on_options_load(function() {
    var url = X.sanitize(FX.option('external_css_url'));
    if (url) {
        X.when('head',function($head) {
            $head.append(`<link id="sfx_external_css" rel="stylesheet" type="text/css" href="${url}">`);
        })
    }
});

// =========================================================
// Fix timestamps
// =========================================================
FX.add_option('fix_timestamps',{"title":'Fix Post Timestamps',"description":'Change post and comment timestamps from relative times (1hr) to absolute date/time.',"default":true});

FX.on_options_load(function() {
	FX.on_content_loaded(function() {
		if (FX.option('fix_timestamps')) {
			X('html').addClass("sfx_fix_timestamps");
		
			var remove_current_year = new RegExp(", "+ (new Date()).getFullYear());
			//<abbr class="_35 timestamp" data-utime="1369109136.835" title="Today">11:05pm</abbr>
			//<abbr class="timestamp livetimestamp" data-utime="1369109191" title="Monday, May 20, 2013 at 11:06pm">3 minutes ago</abbr>
			function fix_timestamps(o) {
				if (X.find('#MessagingDashboard')) { return; }
				o.find('abbr[data-utime][title]').each(function(i,a){ 
					a = X(a);
					// If the timestamp is already in long form, don't apply the conversion
					if (/at/.test(a.html())) {
						a.addClass('sfx_no_fix_timestamp');
					}
					var title = a.attr('title') || "";
					title = title.replace(remove_current_year,"");
					a.attr('title',title);
				});
			}
			
			fix_timestamps( X(document.body) );
			
			X.subscribe(["post/add","post/update"], function(msg,data) {
				fix_timestamps( data.dom );
			});
		
		}
	});
});

// ========================================================
// 
// ========================================================
FX.add_option('font_family', {
	"section":"User Interface"
	,"title":"Custom Font"
	,"description":"Set a custom font name using CSS syntax to override the default Facebook fonts. You may add multiple fonts, separated by comma."
	,"type":"text"
	,"default":""
});
FX.on_options_load(function() {
	var font = FX.option('font_family');
	if (font) {
		var css = 'body, body *, #facebook body, #facebook body._-kb { font-family:' + font + ' !important; }';
		FX.css(css);
	}
});

// =========================================================
// Hide parts of the page
// =========================================================
// Add an Option to trigger the popup in case people don't find it in the wrench menu
FX.add_option('hide_parts_of_page',
	{
		"section": "User Interface",
		"title": 'Hide Things',
		"description": 'Under the Wrench menu you will find an item to "Hide/Show Parts of the Page". Use this to hide or show different parts of the page that Social Fixer knows how to process. You can also access this functionality using the button to the right.',
		"type":"action",
		"action_message":"options/close,hide/on",
		"action_text":"Hide Things"
	}
);
FX.on_options_load(function() {
	var menu_item = {"html":'Hide/Show Parts of the Page',"message":"hide/on","tooltip":"Select which parts of the page you want to hide so they never show up."};
	X.publish("menu/add", {"section":"actions","item":menu_item});

	var hiddens = FX.storage('hiddens') || {};
	if (typeof hiddens.length!="undefined") { hiddens={}; }

	var resolve = function(hideable) {
		var o = X(hideable.selector);
		if (hideable.parent) {
			o = o.closest(hideable.parent);
		}
		return o;
	};

	//  Two ways to hide things:
	// (1) Pure CSS if the hideable has no parent, or
	// (2) by watching for DOM insertions
	var id;
	var css = [], hiddens_with_parents=[];
	var set_css_rules = function() {
		css = [];
		hiddens_with_parents = [];
		for (id in hiddens) {
			var hidden = hiddens[id];
			var o = resolve(hidden);

			// (1)
			if (!hidden.parent) {
				css.push(`html:not(.sfx_hide_show_all) ${hidden.selector} { display:none !important; }`);
				o.addClass("sfx_hide_hidden");
			}
			// (2)
			else {
				hiddens_with_parents.push(hidden);
			}
		}
		if (css.length > 0) {
			var csstext = css.join(' ');
			X.css(csstext, 'sfx_hideables');
		}
	};
	set_css_rules();
	// Watch for DOM insertions and check for things to hide
	FX.on_content(function(o) {
		hiddens_with_parents.forEach(function(hidden) {
			X(hidden.selector,o).closest(hidden.parent).addClass("sfx_hide_hidden");
		});
	});

	X.subscribe("hide/on", function() {
		// Display the bubble popup
		var content = X(`
					<div class="sfx_hide_bubble">
						<div>Areas of the page that are available to be hidden are highlighted in green. Click a box to mark it as hidden, and it will turn red to mark your choice.</div>
						<div>Facebook's code changes frequently, and new panels or objects are also created. In these cases, Social Fixer will automatically update itself as code can be found to hide content areas. If you find an area you would like to hide that Social Fixer doesn't know about yet, suggest it in the Support Group and we'll see if we can add it. Unfortunately, not everything can be hidden with code.</div>
						<div>When finished, click the button below. Hidden areas will vanish and remain hidden each time you visit Facebook. To see them again, use the same menu item under the wrench.</div>
						<div><input type="button" class="sfx_button" value="Done Hiding"></div>
					</div>
				`);

		var popup = bubble_note(content,{"position":"top_right","title":"Hide Parts of the Page"});
		popup.find('.sfx_button').click(function() {
			X.publish("hide/off");
			popup.remove();
		});

		X.ajax("https://matt-kruse.github.io/socialfixerdata/hideable.json", function(content) {
			if (content && content.hideables && content.hideables.length>0) {
				X('html').addClass('sfx_hide_show_all');
				content.hideables.forEach(function(hideable) {
					var o = resolve(hideable);
					var hidden = false;
					if (o.length) {
						var el = o[0];
						var overflow = o.css('overflow');
						o.css('overflow','auto');
						var rect = el.getBoundingClientRect();
						var h = rect.height;
						var w = rect.width;
						o.css('overflow',overflow);
						hideable.name = X.sanitize(hideable.name);
						var wrapper = X(`<div title="${hideable.name}" class="sfx_hide_frame" style="width:${w}px;height:${h}px;font-size:${h/1.5}px;line-height:${h}px;">X</div>`);
						if (hiddens[hideable.id]) {
							wrapper.addClass("sfx_hide_frame_hidden");
							hidden = true;
						}
						wrapper.click(function() {
							hidden = !hidden;
							wrapper.toggleClass("sfx_hide_frame_hidden",hidden);
							o.toggleClass("sfx_hide_hidden",hidden);
							if (hidden) {
								hiddens[hideable.id] = hideable;
							}
							else {
								delete hiddens[hideable.id];
							}
						});
						o.before(wrapper);
					}
				});
			}
		});
	});
	
	X.subscribe("hide/off", function() {
		X('html').removeClass('sfx_hide_show_all');
		X('.sfx_hide_frame').remove();
		// Persist hidden areas
		X.storage.save('hiddens',hiddens,function() {
			set_css_rules();
		});
	});
});

FX.add_option('redirect_home_links',{"section":"User Interface","title":'Home Links',"description":'Force the F logo and Home link in the blue header bar to reload the page so Social Fixer features continue to work.',"default":true});
FX.add_option('redirect_home_links_most_recent',{"section":"User Interface","title":'Home Links',"description":'When clicking the F logo and Home link, force it to go directly to the Most Recent feed.',"default":true});
FX.on_options_load(function() {
    if (FX.option('redirect_home_links')) {
        var capture = function ($a) {
            X.capture($a, 'click', function (e) {
                if (FX.option('redirect_home_links_most_recent')) {
                    $a.attr('href','/?sk=h_chr');
                }
                e.stopPropagation();
            });
        };
        FX.on_page_load(function () {
            X.when('h1[data-click="bluebar_logo"] a', capture);
            X.when('div[data-click="home_icon"] a', capture)
        });
    }
});

// =========================================================
// Add Post Action Icons, including Mark Read
// =========================================================
FX.add_option('post_actions',{"title":'Post Actions',"description":"Add actions to individual posts to mark them as read, etc.","default":true});
FX.add_option('show_mark_all_read',{"title":'Mark All Read/Undo',"description":"Add a Mark All Read button and Undo button to the control panel to mark all visible posts as read or undo marking posts as read.","default":false});
FX.add_option('mark_all_read_next',{"section":"Advanced","title":'Mark All Read - Next',"description":"When Mark All Read is clicked and filter tabs are visible, automatically jump to the next tab with unread stories.","default":true});
FX.add_option('clear_cache',{"title":'Clear "Mark Read" Story Data',"section":"Advanced","description":"Clear all cached data about posts 'read' status. This will unmark all 'read' posts!","type":"action","action_text":"Clear Data Now","action_message":"cache/clear"});
FX.add_option('clean_cache_frequency',{"title":'"Mark Read" Cache Cleaning Frequency',"section":"Advanced","description":"Clean the cache of old story data every how many hours?","type":"number","default":24});
FX.add_option('clean_cache_age',{"title":'"Mark Read" Cache Cleaning Age',"section":"Advanced","description":"When cleaning cached story data, clean post data it is this many days old.","type":"number","default":4});
FX.add_option('hide_mark_read_groups',{"title":'Mark Read',"description":"Hide posts marked as Read when viewing a Group.","default":true});
FX.add_option('hide_mark_read_pages',{"title":'Mark Read',"description":"Hide posts marked as Read when viewing a Page or Timeline.","default":true});
FX.add_option('mark_read_display_message',{"title":'Mark Read',"description":"Display a small post timestamp where posts marked as 'read' and hidden would have been.","default":true});
FX.add_option('mark_read_style',{"section":"Advanced","title":'Mark Read Style',"description":"CSS style to be applied to posts that are marked Read.","type":"text","default":"outline:1px dashed red;"});

(function() {
	var postdata = {}; // Keyed by DOM id!
	X.subscribe("log/postdata",function(msg,data) {
		if (!data.id) { return; }
		postdata[data.id] = postdata[data.id] || [];
		postdata[data.id].push(data.message);
	});
	X.subscribe("log/postdata/get",function(msg,data) {
		if (typeof data.callback!="function") { return; }
		data.callback(postdata[data.id]);
	})
})();
// Clear Cache
X.subscribe("cache/clear",function(msg,data) {
	X.storage.save("postdata",{},function() {
		alert("Social Fixer cache has been cleared");
	});
});
FX.on_options_load(function() {
	if (!FX.option('post_actions')) { return; }

	// Write out CSS based on "mark read" style
	var mark_read_style = FX.option('mark_read_style');
	FX.css(`
		.sfx_post_read > *:not(.sfx_post_marked_read_note), 
		#facebook #pagelet_soft_permalink_posts .sfx_post_read > *,
		#facebook[sfx_context_permalink="true"] .sfx_post_read > * {
			${mark_read_style};
		}
	`);

	// Add an option to the wrench menu to toggle stories marked as read
	var menu_item = {"html":'Show posts marked "read"',"message":"post/toggle_read_posts","tooltip":"If posts are marked as read and hidden, toggle their visibility."};
	X.publish("menu/add", {"section":"actions","item":menu_item});

	var show_read = false;
	X.subscribe("post/toggle_read_posts",function() {
		show_read = !show_read;
		menu_item.html = show_read ? 'Hide posts marked "read"' : 'Show posts marked "read"';
		X('html').toggleClass("sfx_show_read_posts", show_read);
		FX.reflow();
	});

	// Logic to handle post actions
	var postdata = FX.storage('postdata') || {};

	// On a regular interval, clean out the postdata cache of old post data
	var clean_cache_frequency = FX.option('clean_cache_frequency') || +FX.options['clean_cache_frequency']['default'] || 24;
	var clean_cache_age = FX.option('clean_cache_age') || +FX.options['clean_cache_age']['default'] || 7;
	X.task('clean_postdata_cache', clean_cache_frequency*X.hours, function() {
		var post_id, cleaned_count=0;
		if (!postdata) { return; }
		for (post_id in postdata) {
			var data = postdata[post_id];
			var read_on = data.read_on;
			var age = X.now() - read_on;
			if (age > clean_cache_age*X.days) {
				delete postdata[post_id];
				cleaned_count++;
			}
		}
		// Save the postdata back to storage
		X.storage.save("postdata",postdata, function() {
			console.log("Social Fixer cache cleaned. "+cleaned_count+" posts removed from cache.");
		});
	});

	var init = function(id) {
		if (typeof postdata[id]=="undefined") {
			postdata[id] = {};
		}
		return postdata[id];
	};

	var mark_all_added = false;
	FX.on_page_unload(function() { mark_all_added = false; });

	FX.on_content_loaded(function() {
		var action_data = {
			id:null,
			sfx_id:null,
			$post:null,
			read:false,
            show_mark_read:true,
			filters_enabled:FX.option('filters_enabled'),
			wrench_items: [],
			filter_items: []
		};
		var actions = {
			mark_read:function() {
				X.publish("post/mark_read", {"sfx_id":action_data.sfx_id} );
			}
			,unmark_read:function() {
				X.publish("post/mark_unread", {"sfx_id":action_data.sfx_id} );
			}
			,"action_menu_click":function(item) {
				var key,data = {"id":action_data.id,"sfx_id":action_data.sfx_id};
				if (item.data) {
					for (key in item.data) {
						data[key] = item.data[key];
					}
				}
				X.publish(item.message,data);
			}
		};
		var html = `<div id="sfx_post_action_tray">
			<div v-if="show_mark_read && !read" @click="mark_read" v-tooltip="Mark this post as Read, so it doesn't appear in your news feed anymore. Use the option under the Wrench icon to show Read posts.">&#10004;</div>
			<div v-if="show_mark_read && read" @click="unmark_read" v-tooltip="Un-Mark this post as Read so it shows up in your news feed again.">X</div>
			<div v-if="!show_mark_read" v-tooltip="{content:'This post cannot be marked as read because it lacks a unique facebook identifier which is used to remember that this post was read. Posts like these may be markable in the future.',delay:50}">X</div>
			<div v-if="wrench_items.length>0" @click="wrench_menu()" id="sfx_mark_read_wrench" class="mark_read_wrench"></div>
			<div v-if="filters_enabled && filter_items.length>0" @click="filter_menu()" id="sfx_mark_read_filter" class="mark_read_filter"></div>
		</div>
		<div v-if="wrench_items.length>0" id="sfx_post_wrench_menu" class="sfx_post_action_menu">
			<div v-for="item in wrench_items" @click="action_menu_click(item)">{{item.label}}</div>
		</div>
		<div v-if="filter_items.length>0" id="sfx_post_filter_menu" class="sfx_post_action_menu">
			<div v-for="item in filter_items" @click="action_menu_click(item)">{{item.label}}</div>
		</div>
		`;

		var undo = {
			posts_marked_read: []
			,undo_disabled: true
		};
		var hide_read = function($post) {
			if (!$post.hasClass('sfx_post_read')) {
				var context = X('html').attr('sfx_context_type');
				if (context=="groups" && !FX.option('hide_mark_read_groups')) { return; }
				if (context=="profile" && !FX.option('hide_mark_read_pages')) { return; }
				if (FX.option('mark_read_display_message')) {
					var ts = $post.find('abbr.timestamp,abbr.sfx_no_fix_timestamp').attr('title');
					ts = ts ? 'Read: [ '+ts+' ]' : 'Hidden Post';
					var note = X(`<div class="sfx_post_marked_read_note" title="This post was hidden because it was previously marked as Read. Click to view.">${ts}</div>`);
					note.on('click',function() {
						note.parent().toggleClass('sfx_post_read_show');
					});
					$post.prepend(note);
				}
				$post.addClass('sfx_post_read');
				X.publish("post/hide_read", {"id": $post.attr('id')});
			}
		};
		var unhide_read = function($post) {
			if ($post.hasClass('sfx_post_read')) {
				$post.removeClass('sfx_post_read');
				X.publish("post/unhide_read", {"id": $post.attr('id')});
			}
		};
		// Mark Read/Unread controllers
		X.subscribe("post/mark_unread", function(msg,data) {
			var sfx_id = data.sfx_id;
			var $post = data.post || action_data.$post;

			var pdata = postdata[sfx_id];
			//pdata.last_updated = X.now();
			delete pdata.read_on;

			X.storage.set("postdata",sfx_id,pdata,function() {
				unhide_read($post);
			},false!==data.save);
		});
		X.subscribe("post/mark_read", function(msg,data) {
			var sfx_id = data.sfx_id;
			var $post = data.post || action_data.$post;
			// for undo
			undo.posts_marked_read = [$post];
			undo.undo_disabled = false;

			var pdata = init(sfx_id);
			var t = X.now();
			//pdata.last_updated = t;
			pdata.read_on = t;

			postdata[sfx_id] = pdata;
			X.storage.set("postdata",sfx_id,pdata,function() {
				hide_read($post);
				FX.reflow();
			},false!==data.save);
		});
		X.subscribe("post/mark_all_read", function(msg,data) {
			var marked = 0;
			var posts = [];
			X(`*[sfx_post]`).each(function() {
				var $post = X(this);
				if ("none"!=$post.css('display') && !$post.hasClass('sfx_post_read')) {
					var sfx_id = $post.attr('sfx_id');
					posts.push($post);
					X.publish("post/mark_read", {"sfx_id":sfx_id,"save":false,"post":$post}); // Don't persist until the end
					marked++;
				}
			});
			if (marked>0) {
				X.storage.save("postdata");
				undo.posts_marked_read = posts;
				undo.undo_disabled = false;
			}
			if (FX.option('mark_all_read_next')) {
				X.publish("filter/tab/next");
			}
			FX.reflow();
		});
		X.subscribe("post/undo_mark_read", function(msg, data) {
			if (undo.posts_marked_read.length>0) {
				undo.posts_marked_read.forEach(function ($post) {
					var sfx_id = $post.attr('sfx_id');
					X.publish("post/mark_unread", {"sfx_id": sfx_id, "save": false, "post": $post});
				});
				X.storage.save("postdata");
				undo.posts_marked_read = [];
				undo.undo_disabled = true;
				FX.reflow();
			}
			else {
				alert("Nothing to Undo!");
			}
		});

		var add_post_action_tray = function() {
			if (document.getElementById('sfx_post_action_tray')==null) {
				template(document.body,html,action_data,actions);
				X('#sfx_mark_read_wrench').click(function(ev) {
					var menu = X('#sfx_post_wrench_menu');
					menu.css('left',ev.pageX+'px');
					menu.css('top',ev.pageY+'px');
					menu.show();
					ev.stopPropagation();
				});
				X('#sfx_mark_read_filter').click(function(ev) {
					var menu = X('#sfx_post_filter_menu');
					menu.css('left',ev.pageX+'px');
					menu.css('top',ev.pageY+'px');
					menu.show();
					ev.stopPropagation();
				});
			}
		};
		X(window).click(function() {
			X('#sfx_post_filter_menu, #sfx_post_wrench_menu').hide();
		});

		X.subscribe(["post/add","post/update"],function(msg,data) {
			// If it's already read, hide it
			var sfx_id = data.sfx_id;
			if (sfx_id) {
				if (typeof postdata[sfx_id]!="undefined") {
					if (postdata[sfx_id].read_on) {
						hide_read(data.dom);
					}
				}
			}

			if (msg=="post/add") {
				// Add the "Mark All Read" button to the control panel if necessary
				if (!mark_all_added && FX.option('show_mark_all_read')) {
					mark_all_added = true;
					X.publish("cp/section/add", {
						"name":"Post Controller"
						,"order":10
						,"id":"sfx_cp_post_controller"
						,"help":"Act on all visible posts at once"
					});
					// Wait until that has been rendered before attaching to it
					Vue.nextTick(function() {
						// The content container will have been created by now
						var html = `<div class="sfx_cp_mark_all_read" style="text-align:center;">
                    		<input type="button" class="sfx_button" value="Mark All Read" @click="mark_all_read">
                    		<input type="button" class="sfx_button" v-bind:disabled="undo_disabled" value="Undo ({{posts_marked_read.length}})" @click="undo_mark_read">
                		</div>`;
						var methods = {
							"mark_all_read": function() {
								X.publish("post/mark_all_read");
							},
							"undo_mark_read": function() {
								X.publish("post/undo_mark_read");
							}
						};
						template('#sfx_cp_post_controller', html, undo, methods);
					});
				}

				// When the mouse moves over the post, add the post action tray
				data.dom.on('mouseenter', function () {
					action_data.$post = data.dom;
					action_data.id = action_data.$post.attr('id');
					action_data.sfx_id = action_data.$post.attr('sfx_id');
                    if (!action_data.sfx_id) {
                        action_data.show_mark_read=false;
                    }
                    else {
                        action_data.show_mark_read=true;
                        action_data.read = (postdata[action_data.sfx_id] && postdata[action_data.sfx_id].read_on);
                    }
                    add_post_action_tray();

                    var anchor = action_data.$post;
                    var position = action_data.$post.find('.userContentWrapper').first();
                    if (position) {
                        anchor = X(position);
                    }
                    anchor.append(document.getElementById('sfx_post_action_tray'));
				});
			}
		});

		X.subscribe("post/action/add",function(msg,data) {
			if (data.section=="wrench") {
				action_data.wrench_items.push(data);
			}
			else if (data.section=="filter") {
				action_data.filter_items.push(data);
			}
		},true);

		X.publish('post/action/add',{"section":"wrench","label":"Post Data","message":"post/action/postdata"});
		X.subscribe('post/action/postdata',function(msg,data) {
			var log = [];
			X.publish("log/postdata/get",{"id":data.id,"callback":function(pdata) {
				log = pdata;
			}});
			log = log.join("<br>");
			var data_content = JSON.stringify(postdata[action_data.id] || {},null,3);
			var content = `
				<div draggable="false">This popup shows what Social Fixer remembers about this post.</div>
				<div draggable="false" class="sfx_bubble_note_data">Post ID: ${action_data.sfx_id}<br>DOM ID: ${action_data.id}</div>
				<div draggable="false">Data stored for this post:</div>
				<div draggable="false" class="sfx_bubble_note_data">${data_content}</div>
				<div draggable="false">Processing Log:</div>
				<div draggable="false" class="sfx_bubble_note_data">${log}</div>
			`;
			// Remove the previous one, if it exists
			X('#sfx_post_data_bubble').remove();
			var note = bubble_note(content,{"position":"top_right","title":"Post Data","id":"sfx_post_data_bubble","close":true});
		});
	});
});

FX.add_option('badge_x', {"hidden":true,"default":-64} );
FX.add_option('badge_y', {"hidden":true,"default":5} );
FX.add_option('reset_wrench_position',{"title":'Reset Menu Position',"section":"Advanced","description":"If your wrench menu badge somehow gets positioned so you can't see it, click here to reset its position to the upper right corner.","type":"action","action_text":"Reset Position","action_message":"menu/reset_position"});
FX.add_option('news_alerts',{"title":'Social Fixer News',"section":"Advanced","description":"Check for official news or blog posts from the Social Fixer team so you don't miss out on updates, updated filters, important news, etc. (Estimated frequency is one post a week)","default":true});
(function() {

	var actions = {
		"add":function(section,menu_item) {
			data.sections[section].items.push(menu_item);
		}
		,"click":function(message) {
			if (message) { X.publish(message); }
		}
		,"toggle":function() {
			var $badge = X('#sfx_badge');
			var $menu = X('#sfx_badge_menu');
			if ($menu.css('display')=='none') {
				$menu.css('visibility','hidden');
				$menu.show();
				// Figure out which direction to pop the menu
				var window_width = document.body.clientWidth || window.innerWidth;
				var window_height = window.innerHeight;
				var left = $badge[0].offsetLeft;
				var top = $badge[0].offsetTop;

				if (left<=window_width/2) {
					$menu.addClass('right').removeClass('left');
				}
				else {
					$menu.addClass('left').removeClass('right');
				}

				if (top<=window_height/2) {
					$menu.addClass('down').removeClass('up');
				}
				else {
					$menu.addClass('up').removeClass('down');
				}
				$menu.css('visibility','');
			}
			else {
				X('#sfx_badge_menu').hide();
			}
		}
		,"hide":function() {
			X('#sfx_badge_menu').hide();
		}
		,"notify":function(id,count) {
			if (count>0) {
				X.publish("notify/set", {"target": '#' + id, "count": count});
			}
			else {
				X.publish("notify/clear", {"target": '#' + id});
			}
			update_total_notify();
		}
	};
	var update_total_notify = function() {
		var count = 0;
		X('#sfx_badge_menu').find('.sfx_notification_count').forEach(function(c) {
			count += (+c.innerHTML || 0);
		});
		data.notify_count = count;
	};
	var data = {
		"notify_count":0,
		"sections": {
			"options": {
				"title": "Options",
				"items": [],
				"order":1
			},
			"actions": {
				"title": "Actions",
				"items": [],
				"order":2
			},
			"links": {
				"title": "Links",
				"items": [],
				"order":3
			},
			"debug": {
				"title": "Debug",
				"items": [],
				"order":4
			},
			"other": {
				"title": "Other",
				"items": [],
				"order":5
			}
		}
	};
	var html = `
		<div id="sfx_badge" @click.stop="toggle">
			<div class="sfx_notification_count" v-if="notify_count>0">{{notify_count}}</div>
			<div id="sfx_badge_menu">
				<div id="sfx_badge_menu_wrap">
					<div v-for="section in sections | orderBy 'order'" class="sfx_menu_section" id="sfx_menu_section_{{$key}}">
						<div v-if="section.items.length" class="sfx_menu_section_title">{{section.title}}</div>
						<div v-for="item in section.items" id="{{item.id}}" class="sfx_menu_item" @click="click(item.message);" data-hover="tooltip" data-tooltip-position="left" data-tooltip-delay="500" data-tooltip-content="{{item.tooltip}}">
							<a v-if="item.url" href="{{item.url}}" class="sfx_menu_item_content" style="display:block;">{{{item.html}}}</a>
							<div v-else class="sfx_menu_item_content">{{{item.html}}}</div>
						</div>
					</div>
				</div>
			</div>
			<div id="sfx_badge_logo"></div>
		</div>
	`;

	FX.on_content_loaded(function(doc) {
		if (X.find('#login_form')) { return; } // Don't show on login

		// If the badge already exists for some reason, remove it and re-add it
		X('#sfx_badge').remove();

		// Attach the menu template to the DOM
		template("body",html,data,actions).ready(function() {
			position_badge(null,null,false);
			X.draggable('#sfx_badge', function(el,x,y) {
				position_badge(x,y);
			});
		});

		// If this is the first install, show the user where the badge is
		FX.on_options_load(function() {
			var stats = FX.storage('stats');
			if (!stats.installed_on) {
				var note = sticky_note("#sfx_badge", "left", "Social Fixer is installed! Start here &rarr;",{"close":false});
				X('#sfx_badge').mouseover(function() {
					note.remove();
					stats.installed_on = X.now();
					X.storage.set('stats',"installed_on",X.now());
				});
			}
		});
	});

	var position_badge = function(x,y,save) {
		var $badge = X('#sfx_badge');
		var reposition = false;
		if (typeof x=="undefined" || x==null || typeof y=="undefined" || y==null) {
			// Re-position it with saved options
			x = +FX.option('badge_x');
			y = +FX.option('badge_y');
			reposition = true;
		}
		var h = $badge[0].offsetHeight, w = $badge[0].offsetWidth;
		var window_width = document.body.clientWidth || window.innerWidth;
		var window_height = window.innerHeight;
		// If dragged, adjust
		if (!reposition) {
			if (x < 1) { x = 1; }
			else if (x > (window_width - w)) { x = window_width - w; }
			if (y < 1) { y = 1; }
			else if (y > (window_height - h)) { y = window_height - h; }

			// If the position is on the right half or bottom half of the screen, store it as negative so it's relative to the opposite edge
			if (x>window_width/2) { x=x-window_width;}
			if (y>window_height/2) { y=y-window_height;}
		}
		else {
			// Make sure it's on the screen
			if (x > (window_width - w)) { x = window_width - w; }
			else if (x < -window_width) { x=0; }
			if (y > (window_height - h)) { h = window_height - h; }
			else if (y < -window_height) { y=0; }
		}

		// Position it
		$badge.css({'left': (x>0 ? x : (window_width+x)) ,'top': (y>0 ? y : (window_height+y)) });

		// Persist the control panel location
		if (false!==save) {
			FX.option('badge_x', x, false);
			FX.option('badge_y', y, false);
			X.storage.save("options");
		}
	};

	actions.add('options',{'html':'Social Fixer Options <span style="font-size:10px;color:#aaa;">(Ctrl+Shift+X)</span>','message':'menu/options'});

	actions.add('links',{'id':'sfx_badge_menu_item_page','html':'Social Fixer News/Blog',url:'/socialfixer','message':'menu/news_clicked'});
	actions.add('links',{'html':'Support Group','url':'https://www.facebook.com/groups/412712822130938/'});
	//actions.add('links',{'html':'Blog','url':'http://SocialFixer.com/blog/'});
	//actions.add('links',{'html':'Known Issues / Bugs','url':'http://SocialFixer.com/bugs'});
	//actions.add('links',{'html':'Frequently Asked Questions','url':'http://SocialFixer.com/faq.html'});
	actions.add('links',{'html':'Donate To Support Development','url':'http://socialfixer.com/donate.html'});

	actions.add('other',{'html':'Version 15.1.0','message':'menu/about_clicked'});
	
	// Listen for messages to add items to the menu
	X.subscribe('menu/add',function(msg,data) {
		actions.add(data.section,data.item);
	},true);

	X(window).click(actions.hide);
	window.addEventListener('resize',function() { position_badge(); });
	// If options are updated from another tab, move the control panel
	X.subscribe("storage/refresh", function(msg,data) {
		if ("options"==data.key) {
			position_badge(null, null, false);
		}
	});

	// About
	X.subscribe('menu/about_clicked', function() {
		X.publish("menu/options", {"section":"About"});
	});

	// NEWS CHECK
	// Check for Posts to the Social Fixer Page and alert if there are new ones
	FX.on_options_load(function() {
		X.task('news_alerts',1*X.seconds, function() {
			if (FX.option('news_alerts')) {
				X.when('#sfx_badge_menu_item_page', function ($item) {
					var now = X.now();
					X.storage.get('stats', {}, function (stats) {
						if (!stats || !stats.sfx_news_checked_on) {
							X.storage.set("stats", "sfx_news_checked_on", now, function () {
							});
						}
						else {
							X.ajax("https://matt-kruse.github.io/socialfixerdata/news.json", function (json) {
								if (!json || !json.news) {
									return;
								}
								var count = 0, title = null;
								json.news.reverse().forEach(function (news) {
									if (news.time > stats.sfx_news_checked_on) {
										$item.find('a').attr('href',news.href);
										title = X.sanitize(news.title);
										count++;
									}
								});
								actions.notify('sfx_badge_menu_item_page', count);
								if (count == 1) {
									if (title) {
										$item.find('.sfx_menu_item_content').append('<div class="sfx_news_title">' + title + '</div>'); // sanitized
									}
								}
							});
						}
					});
				});
			}
		});
	});
	X.subscribe('menu/news_clicked', function (msg, data) {
		// Clear when clicked
		X.storage.set("stats", "sfx_news_checked_on", X.now(), function () {
			actions.notify('sfx_badge_menu_item_page', 0);
		});
		//window.open(news_clicked_url);
	});

	// Create a keyboard shortcut to open Options
	X(window).on('keypress', function(e) {
		if ((e.keyCode==24 || e.key=="X") && e.ctrlKey && e.shiftKey) {
			X.publish("menu/options");
		}
	});

	X.subscribe("menu/reset_position", function(msg,data) {
		var undef;
		X.storage.set('options',{'badge_x':undef, 'badge_y':undef},function(){position_badge();});
	});

})();

// =========================================================
// For Message links to open Messenger instead of a chat box
// =========================================================
FX.add_option('messages_open_in_full_window',{"title":'Open Messages In full Window',"description":"When clicking a chat message in the blue bar dropdown, open the message in a full window instead of a chat box.","default":false});
FX.on_options_load(function() {
	if (FX.option('messages_open_in_full_window')) {
		X.bind(document.documentElement,'click',function(e) {
			var $t = X.target(e,true);
			var href = $t.closest('a.messagesContent[href*="facebook.com/messages"]').attr('href');
			if (href) {
				window.open(href);
				e.stopPropagation();
				e.preventDefault();
			}
		},true);
	}
});

// =========================================================
// Force the News Feed to be the Most Recent view
// =========================================================
FX.add_option('auto_switch_to_recent_stories',{"title":'Automatically Switch to Most Recent view of the News Feed',"description":"Facebook defaults to Top Stories. This option detects this view and automatically switches you to the chronological Most Recent view.","default":false});
FX.on_options_load(function() {
	FX.on_content_loaded(function() {
		if (FX.option('auto_switch_to_recent_stories')) {
			var redirect = false;
			var href = window.location.href;
			var redirect_now = function() {
				X(document.body).css('opacity','.2');
				setTimeout(function() {
					window.location.href="/?sk=h_chr&sfx_switch=true";
				},200);
			};
			if (/sfx_switch=true/.test(href)) {
				var note = sticky_note(X('#sfx_badge')[0],'left','Auto-switched to Most Recent',{close:false});
				setTimeout(function(){note.remove();},3000);
			}
			else if (/sk=h_nor/.test(href)) {
				redirect_now();
			}
			else if(!/sk=h_chr/.test(href)) {
				X.poll(function(count) {
					if (!X.find('div[id^="topnews_main_stream"]')) { return false; }
					redirect_now();
				}, 200, 20 );
			}
		}
	});
});
X.subscribe("notify/set", function(msg,data) {
    var $target = X(data.target);
    var position = $target.css('position');
    if (position=="" || position=="static") {
        $target.css('position','relative');
    }
    var $counter = $target.find('.sfx_notification_count');
    if (!$counter.length) {
        $target.prepend('<div class="sfx_notification_count">0</div>');
        $counter = $target.find('.sfx_notification_count');
    }
    var count = +$counter.html() || 0;
    if (typeof data.count!="undefined") {
        count = data.count;
    }
    if (typeof data.increment!="undefined") {
        count++;
    }
    $counter.text(count);
});

X.subscribe("notify/increment", function(msg,data) {
    data.increment = true;
    X.publish("notify/set",data);
});

X.subscribe("notify/clear", function(msg,data) {
    X(data.target).find('.sfx_notification_count').remove();
});
FX.on_options_load(function() {
	// Update Tweaks and Filtes in the background every so often
	X.task('update_filter_subscriptions', 4*X.hours, function() {
		update_subscribed_filters(FX.storage('filters'));
	});
	X.task('update_tweak_subscriptions', 4*X.hours, function() {
		update_subscribed_tweaks(FX.storage('tweaks'));
	});

	// Update user subscriptions with data from the server
	var retrieve_filter_subscriptions = function(user_filters, callback) {
		X.ajax("https://matt-kruse.github.io/socialfixerdata/filters.json", function(content) {
			if (content && content.filters && content.filters.length>0) {
				// Mark the subscribed ones
				mark_subscribed_filters(content.filters, user_filters);
				if (callback) {
					callback(content.filters);
				}
			}
		});
	};
	// Mark filter subscriptions as subscribed if the user has added them
	var mark_subscribed_filters = function(subscriptions, user_filters) {
		// Build up a list of user filter id's
		var subscription_ids = {};
		if (user_filters && user_filters.length) {
			user_filters.forEach(function(f) {
				if (f.id) { subscription_ids[f.id]=true; }
			});
		}
		subscriptions = subscriptions || [];
		if (subscriptions && subscriptions.length) {
			subscriptions.forEach(function(filter) {
				filter.subscribed = (!!subscription_ids[filter.id]);
			});
		}
	};
	var update_subscribed_filters = function(user_filters,callback) {
		retrieve_filter_subscriptions(user_filters,function(subscriptions) {
			if (!subscriptions || subscriptions.length<1) { return; }
			var any_dirty = false;
			// Loop through the subscriptions to see if user filters need to be updated
			var subscribed = {};
			if (user_filters && user_filters.length) {
				user_filters.forEach(function(f) {
					if (f.id) { subscribed[f.id]=f; }
				});
			}
			subscriptions = subscriptions || [];
			if (subscriptions && subscriptions.length) {
				subscriptions.forEach(function(filter) {
					var user_filter = subscribed[filter.id];
					if (!user_filter) { return; }
					var key, dirty=false;
					// Map the properties of the subscription to the user filter
					// Don't overwrite the entire object because things like 'enabled' are stored locally
					for (key in filter) {
						if (key=="subscribed" || key=="enabled") { continue; }
						// Check to see if the user filter data needs updated
						// If user has customized actions, don't over-write, otherwise update
						if (key=='actions' && filter.configurable_actions && user_filter.custom_actions) {
							continue;
						}
						if (JSON.stringify(user_filter[key]) != JSON.stringify(filter[key])) {
							user_filter[key] = filter[key];
							dirty = true;
						}
					}
					if (dirty) {
						user_filter.subscription_last_updated_on = X.now();
						any_dirty = true
					}
				});
			}
			// if any of the subscriptions were dirty, save the filters
			if (any_dirty) {
				X.storage.save('filters',X.clone(user_filters),function() {});
			}
			if (callback) {
				callback(subscriptions);
			}
		});
	};

	// Update user subscriptions with data from the server
	var retrieve_tweak_subscriptions = function(user_tweaks, callback) {
		X.ajax("https://matt-kruse.github.io/socialfixerdata/tweaks.json", function(content) {
			if (content && content.tweaks && content.tweaks.length>0) {
				// Mark the subscribed ones
				mark_subscribed_tweaks(content.tweaks, user_tweaks);
				if (callback) {
					callback(content.tweaks);
				}
			}
		});
	};
	// Mark tweak subscriptions as subscribed if the user has added them
	var mark_subscribed_tweaks = function(subscriptions, user_tweaks) {
		// Build up a list of user tweak id's
		var subscription_ids = {};
		if (user_tweaks && user_tweaks.length) {
			user_tweaks.forEach(function(f) {
				if (f.id) { subscription_ids[f.id]=true; }
			});
		}
		subscriptions = subscriptions || [];
		if (subscriptions && subscriptions.length) {
			subscriptions.forEach(function(tweak) {
				tweak.subscribed = (!!subscription_ids[tweak.id]);
			});
		}
	};
	var update_subscribed_tweaks = function(user_tweaks,callback) {
		retrieve_tweak_subscriptions(user_tweaks,function(subscriptions) {
			if (!subscriptions || subscriptions.length<1) { return; }
			var any_dirty = false;
			// Loop through the subscriptions to see if user tweaks need to be updated
			var subscribed = {};
			if (user_tweaks && user_tweaks.length) {
				user_tweaks.forEach(function(f) {
					if (f.id) { subscribed[f.id]=f; }
				});
			}
			subscriptions = subscriptions || [];
			if (subscriptions && subscriptions.length) {
				subscriptions.forEach(function(tweak) {
					var user_tweak = subscribed[tweak.id];
					if (!user_tweak) { return; }
					var key, dirty=false;
					// Map the properties of the subscription to the user tweak
					// Don't overwrite the entire object because things like 'enabled' are stored locally
					for (key in tweak) {
						if (key=="subscribed") { continue; }
						// Check to see if the user tweak data needs updated
						if (JSON.stringify(user_tweak[key]) != JSON.stringify(tweak[key])) {
							user_tweak[key] = tweak[key];
							dirty = true;
						}
					}
					if (dirty) {
						user_tweak.subscription_last_updated_on = X.now();
						any_dirty = true
					}
				});
			}
			// if any of the subscriptions were dirty, save the tweaks
			if (any_dirty) {
				X.storage.save('tweaks',X.clone(user_tweaks),function() {

				});
			}
			if (callback) {
				callback(subscriptions);
			}
		});
	};

	// Options Dialog
	var sections = [
		{'name':'General','description':''}
		,{'name':'Filters','description':''}
		,{'name':'User Interface','description':''}
		,{'name':'Display Tweaks','description':''}
		,{'name':'Tips','description':'These are not features of Social Fixer - they are useful Facebook tips that users may not know about, or that I think are especially useful.'}
		,{'name':'Advanced','description':''}
		,{'name':'Experiments','description':'These features are a work in progress, not fully functional, or possibly confusing to users.'}
		,{'name':'Data Import/Export','description':''}
		,{'name':'Themes','url':'https://matt-kruse.github.io/socialfixerdata/themes.html','property':'content_themes'}
		,{'name':'Support','url':'https://matt-kruse.github.io/socialfixerdata/support.html','property':'content_support'}
		,{'name':'Donate','url':'https://matt-kruse.github.io/socialfixerdata/donate.html','property':'content_donate'}
		,{'name':'About','url':'https://matt-kruse.github.io/socialfixerdata/about.html','property':'content_about'}
	];
	var data = {
		"action_button":null
		,"show_action_buttons":true
		,"sections": sections
		,"filters":null
		,"editing_filter":null
		,"editing_filter_index":-1
		,"filter_subscriptions":null
		,"tweak_subscriptions":null
		,"tweaks":null
		,"editing_tweak":null
		,"editing_tweak_index":-1
		,"show_advanced":false
		,"options":FX.options
		,"user_options":""
		,"user_options_message":null
        ,"storage_size": JSON.stringify(X.storage.data).length
		,"sfx_version":version
		,"content_about":"Loading..."
		,"content_donate":"Loading..."
		,"sfx_option_show_donate":false
		,"content_support":"Loading..."
		,"content_themes":"Loading..."
		,"user_agent":navigator.userAgent
	};
	X.subscribe('menu/options',function(event,event_data) {
		try {
			if (X('#sfx_options_dialog').length) { return; }

			// Prepare data for options dialog display.
			// We can't work on the real options object, in case the user cancels.
			// So we need to work on a copy, then overlay it when they save.

			// Convert the options into section-based options
			sections.forEach(function (section_object) {
				var sectionName = section_object.name;
				section_object.options=[];
				if (event_data.section) {
					section_object.selected = (event_data.section==sectionName);
				}
				else {
					section_object.selected = (sectionName=='General');
				}
				for (k in FX.options) {
					var opt = FX.options[k];
					if ((sectionName == 'General' && !opt.section) || (sectionName == opt.section)) {
						opt.newValue = opt.value = FX.option(opt.key);
						section_object.options.push(opt);
					}
				}

				section_object.options = section_object.options.sort(function (a, b) {
					var x = a.title||"";
					var y = b.title||"";
					if (x<y)
						return -1;
					if (x>y)
						return 1;
					return 0;
				});
			});

			var filters = X.clone(X.storage.data['filters']);
			filters.forEach(function(o) {
				// Make sure every filter has rules and actions
				if (!X.def(o.rules)) { o.rules=[]; }
				if (!X.def(o.actions)) { o.actions=[]; }
			});
			data.filters = filters;

			var tweaks = X.clone(X.storage.data['tweaks']);
			data.tweaks = tweaks;

			// Render the options dialog content
			var dialog = `<div id="sfx_options_dialog" class="sfx_dialog flex-column" style="transition: height .01s;">
	<div id="sfx_options_dialog_header" class="sfx_dialog_title_bar" style="cursor:move;" @click="collapse">
		Social Fixer
		<div id="sfx_options_dialog_actions" v-if="show_action_buttons" draggable="false" >
			<input draggable="false" v-if="action_button=='done_editing_filter'" class="sfx_options_dialog_panel_button sfx_button" type="button" value="Done Editing Filter" @click.stop="close_filter">
			<input draggable="false" v-if="action_button=='done_editing_tweak'" class="sfx_options_dialog_panel_button sfx_button" type="button" value="Done Editing Tweak" @click.stop="close_tweak">
			<input draggable="false" v-if="!action_button" class="sfx_button" type="button" @click.stop="save" value="Save Changes">
			<input draggable="false" type="button" class="sfx_button secondary" @click.stop="cancel" value="Cancel">
		</div>
	</div>
	<div id="sfx_options_dialog_body" class="flex-row" draggable="false">
		<div id="sfx_options_dialog_sections">
			<div v-for="section in sections" @click="select_section(section)" class="sfx_options_dialog_section" v-bind:class="{'selected':section.selected}">{{section.name}}</div>
		</div>
		<div id="sfx_options_dialog_content">
			<div v-if="section.selected" v-for="section in sections" class="sfx_options_dialog_content_section">
				<template v-if="section.name=='Filters'">
					<div id="sfx_options_dialog_filters" class="sfx_options_dialog_filters">

					    <div v-if="!editing_filter" class="sfx_options_dialog_filter_list">
					        <div class="">
					            Post Filters let you hide posts, put them in tabs, or change their appearance based on their content. They execute in the order below for each post.
					        </div>
					        <div class="sfx_option" style="margin:10px 10px;font-size:14px;float:left;">
					            <input id="filters_enabled" type="checkbox" v-model="options.filters_enabled.newValue"/><label for="filters_enabled"></label> Post Filtering enabled
					        </div>
					        <div class="sfx_option" style="margin:10px 10px;font-size:14px;float:left;">
					            <input id="filters_enabled_pages" type="checkbox" v-model="options.filters_enabled_pages.newValue"/><label for="filters_enabled_pages"></label> Filter on Pages/Timelines
					        </div>
					        <div class="sfx_option" style="margin:10px 10px;font-size:14px;float:left;">
					            <input id="filters_enabled_groups" type="checkbox" v-model="options.filters_enabled_groups.newValue"/><label for="filters_enabled_groups"></label> Filter in Groups
					        </div>
					        <div class="sfx_options_dialog_panel_header" style="clear:both;">Active Filters</div>
					        <div>
					            <input type="button" class="sfx_button" value="Create A New Filter" @click="add_filter">
					        </div>
					        <table class="sfx_options_dialog_table">
					            <thead>
					            <tr>
					                <th>Title</th>
					                <th>Description</th>
					                <th style="text-align:center;">Actions</th>
					                <th style="text-align:center;">Stop On<br>Match</th>
					                <th style="text-align:center;">Enabled</th>
					            </tr>
					            </thead>
					            <tbody>
					            <tr v-for="filter in filters" v-bind:class="{'!sfx_options_dialog_option_enabled':filter.disabled}">
					                <td class="sfx_options_dialog_option_title">{{filter.title}}<div v-if="filter.id" style="font-weight:normal;font-style:italic;color:#999;margin-top:5px;">(Subscription)</div></td>
					                <td class="sfx_options_dialog_option_description">
					                    {{filter.description}}
					                    <div v-if="filter.id && filter.subscription_last_updated_on" style="font-style:italic;color:#999;margin-top:5px;">Subscription last updated: {{ago(filter.subscription_last_updated_on)}}</div>
					                </td>
					                <td class="sfx_options_dialog_option_action" style="white-space:nowrap;">
					                    <span class="sfx_square_control" v-tooltip="Edit" @click="edit_filter(filter,$index)">&#9998;</span>
					                    <span class="sfx_square_control sfx_square_delete"  v-tooltip="Delete" @click="delete_filter(filter)">&times;</span>
					                    <span class="sfx_square_control" v-tooltip="Move Up" @click="up(filter)">&#9650;</span>
					                    <span v-if="$index<filters.length-1" class="sfx_square_control" v-tooltip="Move Down" @click="down(filter)">&#9660;</span>
					                </td>
					                <td style="text-align:center;">
					                    <input id="sfx_stop_{{$index}}" type="checkbox" v-model="filter.stop_on_match"/><label for="sfx_stop_{{$index}}" v-tooltip="If a post matches this filter, don't process the filters that follow, to prevent it from being double-processed."></label>
					                </td>
					                <td style="text-align:center;">
					                    <input id="sfx_filter_{{$index}}" type="checkbox" v-model="filter.enabled"/><label for="sfx_filter_{{$index}}"></label>
					                </td>
					            </tr>
					            </tbody>
					        </table>

					        <div v-if="filter_subscriptions">
					            <div class="sfx_options_dialog_panel_header">Filter Subscriptions</div>
					            <div>The pre-defined filters below are available for you to use. These "Filter Subscriptions" will be automatically maintained for you, so as Facebook changes or more keywords are needed to match a specific topic, your filters will be updated without you needing to do anything!</div>
					            <table class="sfx_options_dialog_table">
					                <thead>
					                <tr>
					                    <th>Title</th>
					                    <th>Description</th>
					                    <th>Actions</th>
					                </tr>
					                </thead>
					                <tbody>
					                <tr v-for="filter in filter_subscriptions" v-bind:class="{'sfx_filter_subscribed':filter.subscribed}">
					                    <template v-if="version_check(filter)">
					                    <td class="sfx_options_dialog_option_title">{{filter.title}}</td>
					                    <td class="sfx_options_dialog_option_description">{{filter.description}}</td>
					                    <td class="sfx_options_dialog_option_action">
					                        <span class="sfx_square_add" v-tooltip="Add To My Filters" @click="add_subscription(filter)">+</span>
					                    </td>
					                    </template>
					                </tr>
					                </tbody>
					            </table>
					        </div>
					    </div>

					    <div v-if="editing_filter" class="sfx_options_dialog_panel">
					        <div class="sfx_panel_title_bar">Edit Filter</div>
					        <div class="sfx_info" v-if="editing_filter.id">
					            This filter is a subscription, so its definition is stored on the SocialFixer.com server and updated automatically for you. If you wish to edit this filter, you can do so but it will "break" the subscription and your copy will be local and no longer updated automatically as Facebook changes.
					            <br><input type="button" class="sfx_button" value="Convert to local filter" @click="editing_filter.id=null"/>
					        </div>
					        <div class="sfx_label_value">
					            <div>Title:</div>
					            <div><input class="sfx_wide" v-model="editing_filter.title" v-bind:disabled="editing_filter.id"/></div>
					        </div>
					        <div class="sfx_label_value">
					            <div>Description:</div>
					            <div><input class="sfx_wide" v-model="editing_filter.description" v-bind:disabled="editing_filter.id"></div>
					        </div>
					        <div class="sfx_options_dialog_filter_conditions sfx_options_dialog_panel">
					            <div class="sfx_panel_title_bar"><span style="float:right;" v-tooltip="{icon:true,content:'Create a condition to test whether each post matches the filter. Select a part of the post to match on, and what kind of test to execute.\n\nContains is a simple text match and is what most users will want. It matches entire words by default (so that Ball does not also match Ballet) but you can choose to match partial words by checking the box.\n\nMatching on Regex or CSS selector are advanced features. See the Support Docs for details.\n\nMultiple conditions may be added, and you can selector whether ALL conditions must be met or if ANY of them are sufficient. You cannot mix and match Any/All in one filter.',position:'left',delay:500}"></span>IF ...</div>
					            <div v-for="rule in editing_filter.rules">
					                <div class="sfx_label_value">
					                    <div><select v-if="$index>0" v-model="editing_filter.match" v-bind:disabled="editing_filter.id"><option value="ALL">AND<option value="ANY">OR</select></div>
					                    <div><select v-model="rule.target" v-bind:disabled="editing_filter.id">
					                        <option value="any">Any Post Content</option>
					                        <option value="content">Post Text Content</option>
					                        <option value="action">Post Action</option>
					                        <option value="author">Author</option>
					                        <option value="app">App/Game Name</option>
					                        <option value="link_url">Link URL</option>
					                        <option value="link_text">Link Text</option>
					                    </select></div>
					                    <div><select v-model="rule.operator" v-bind:disabled="editing_filter.id">
					                        <option value="contains">Contains</option>
					                        <option value="equals">Equals Exactly</option>
					                        <option value="startswith">Starts With</option>
					                        <option value="endswith">Ends With</option>
					                        <option value="matches">Matches Regex</option>
					                        <option value="contains_selector">Matches CSS Selector</option>
					                    </select></div>
					                    <div class="stretch" style="white-space:nowrap;">
					                        <span v-if="rule.operator=='matches'" style="margin-left:10px;font-weight:bold;">/</span>
					                            <input v-if="rule.operator!='matches'" class="sfx_wide" v-on:focus="clear_test_regex" v-on:blur="test_regex" v-model="rule.condition.text" v-bind:disabled="editing_filter.id">
					                            <input v-if="rule.operator=='matches'" class="sfx_wide" v-model="rule.condition.text" style="max-width:70%;" v-bind:disabled="editing_filter.id">
					                        <div v-if="rule.operator=='equals' || rule.operator=='contains'">(Separate words by pipe | to match multiple)</div>
					                        <span v-if="rule.operator=='matches'" style="font-weight:bold;">/</span>
					                        <input v-if="rule.operator=='matches'" v-model="rule.condition.modifier" size="2" v-bind:disabled="editing_filter.id">
					                        <span v-if="rule.operator=='matches'" class="sfx_link" @click="regex_test(rule.condition)"> [test]</span>
					                    </div>
					                    <div v-if="rule.operator=='contains'" style="white-space:nowrap;padding-left:5px;">
					                        <input type="checkbox" class="normal" v-model="rule.match_partial_words" v-bind:disabled="editing_filter.id">
					                        <span v-if="(!editing_filter.id || rule.match_partial_words)"> Match partial words</span>
					                    </div>
					                    <span v-if="editing_filter.rules.length>1" class="sfx_square_control sfx_square_delete" style="margin:0 10px;" v-tooltip="Delete" @click="delete_rule(rule)">&times;</span>
					                </div>
					            </div>
					            <div v-if="!editing_filter.id">
					                <input type="button" class="sfx_button" value="Add A Condition" @click="add_condition">
					            </div>
					        </div>
					        <div class="sfx_options_dialog_filter_actions sfx_options_dialog_panel">
					            <div class="sfx_panel_title_bar"><span style="float:right;" v-tooltip="{icon:true,content:'If the filter condition matches a post, what action should be taken?\n\nCopying or Moving to a tab will cause the Social Fixer Control Panel to appear so you can navigate between tabs.',position:'left',delay:500}"></span>... THEN</div>
					            <div class="sfx_info" v-if="editing_filter.id && editing_filter.configurable_actions && editing_filter.actions[0].action==''">
					                This Filter Subscription defines the rules above, but the action to take is up to you to define. When updated automatically, the rules above will be updated but your selected actions are personal to you.
					            </div>
					            <div class="sfx_info" v-if="editing_filter.id && editing_filter.configurable_actions && editing_filter.actions[0].action!=''">
					                The Actions to take when this filter subscription matches may be changed. If you change the actions, the criteria above will continue to be updated but your customized actions will not be over-written when the filter updates itself.
					            </div>
					            <div v-for="action in editing_filter.actions">
					                <select v-model="action.action" v-bind:disabled="editing_filter.id && !editing_filter.configurable_actions">
					                    <option value=""></option>
					                    <option value="hide">Hide post</option>
					                    <option value="css">Add CSS</option>
					                    <option value="class">Add CSS Class</option>
					                    <option value="replace">Replace text</option>
					                    <option value="move-to-tab">Move post to tab</option>
					                    <option value="copy-to-tab">Copy post to tab</option>
					                </select>
					                <span v-if="action.action=='hide'">
					                    <input type="checkbox" class="normal" v-model="action.show_note" v-bind:disabled="editing_filter.id && !editing_filter.configurable_actions"> Show a note where the post would have been.
					                    <span v-if="action.show_note">Optional Custom Message: <input v-model="action.custom_note" size="20"></span>
					                </span>
					                <span v-if="action.action=='css'">
					                    CSS: <input v-model="action.content" size="45" v-bind:disabled="editing_filter.id && !editing_filter.configurable_actions">
					                </span>
					                <span v-if="action.action=='class'">
					                    <input v-model="action.content" size="45" v-bind:disabled="editing_filter.id && !editing_filter.configurable_actions">
					                </span>
					                <span v-if="action.action=='replace'">
					                    Find: <input v-model="action.find" size="25" v-bind:disabled="editing_filter.id && !editing_filter.configurable_actions">
					                    Replace With: <input v-model="action.replace" size="25" v-bind:disabled="editing_filter.id && !editing_filter.configurable_actions">
					                </span>
					                <span v-if="action.action=='move-to-tab' || action.action=='copy-to-tab'">
					                    Tab Name: <input v-model="action.tab" size="45" v-bind:disabled="editing_filter.id && !editing_filter.configurable_actions">
					                </span>
					                <span v-if="editing_filter.actions.length>1" class="sfx_square_control sfx_square_delete" style="margin:0 10px;" v-tooltip="Delete" @click="delete_action(action)">&times;</span>
					            </div>
					            <div v-if="!editing_filter.id || editing_filter.configurable_actions">
					                <input type="button" class="sfx_button" value="Add An Action" @click="add_action">
					            </div>
					        </div>
					        <div class="sfx_link" @click="show_advanced=!show_advanced" v-tooltip="{position:'above',content:'View the underlying JSON data structure for this filter. The filter can be edited manually here, or you can paste in filter code from someone else to copy their filter exactly.',delay:500}">{{show_advanced?"Hide Advanced Code &#9650;":"Show Advanced Code &#9660;"}}</div>
					        <textarea v-if="show_advanced" style="width:90%;height:150px;font-size:11px;font-family:monospace;" v-model="editing_filter|json" v-bind:disabled="editing_filter.id"></textarea>
					    </div>
					</div>
				</template>
				<template v-if="section.name=='Data Import/Export'">
					<div class="sfx_info">Here you can export all of Social Fixer's stored data, including options, filters, and which stories have been read. When you export, your data will appear in the window, which you can copy and paste somewhere else if you wish. You can also import settings that are pasted into the window. WARNING: This will overwrite your existing settings!</div>
					Total storage space used: {{storage_size | currency '' 0}} bytes<br>
					<input type="button" class="sfx_button" value="Export User Data" @click="populate_user_options()"> <input type="button" class="sfx_button" value="Import Data" @click="import_data()"> <input type="button" class="sfx_button" value="Reset All Data" @click="reset_data()">
					<br>
					<div v-if="user_options_message" class="sfx_info">{{user_options_message}}</div>
					<textarea id="sfx_user_data" v-model="user_options|json" style="width:95%;height:50vh;font-family:courier new,monospace;font-size:11px;"></textarea>
				</template>
				<template v-if="section.name!='Filters'">
					<div v-if="section.description" style="margin-bottom:15px;">{{section.description}}</div>
					<table class="sfx_options_dialog_table">
						<tr v-for="opt in section.options | orderBy title" v-if="!opt.hidden">
							<td class="sfx_options_dialog_option_title {{($index==0 || section.options[$index-1].title!=opt.title)?'':'repeat'}}">{{opt.title}}</td>
							<td class="sfx_options_dialog_option_description">{{opt.description}}
								<input v-if="opt.type=='text'" v-model="opt.newValue" style="display:block;width:{{opt.width || '50%'}};"/>
								<input v-if="opt.type=='number'" type="number" min="{{opt.min||1}}" max="{{opt.max||999}}" v-model="opt.newValue"/>
								<textarea v-if="opt.type=='textarea'" v-model="opt.newValue" style="display:block;width:95%;height:100px;"></textarea>
							</td>
							<td class="sfx_options_dialog_option_action">
								<template v-if="opt.type=='checkbox'">
									<input id="sfx_option_{{opt.key}}" type="checkbox" v-model="opt.newValue"/><label for="sfx_option_{{opt.key}}"></label>
								</template>
								<template v-if="opt.type=='link'">
									<input type="button" data-href="{{opt.url}}" onclick="window.open(this.getAttribute('data-href'));" class="sfx_button" value="GO!">
								</template>
								<template v-if="opt.type=='action'">
									<input type="button" @click="message(opt.action_message)" class="sfx_button" value="{{opt.action_text}}">
								</template>
							</td>
						</tr>
					</table>

					<!-- Custom Section Displays -->
					<template v-if="section.name=='Display Tweaks'">
						<div v-if="!editing_tweak">
						    <div class="">
						        Display Tweaks are small snippets of CSS which change the appearance of the page. They can do anything from changing colors and fonts to hiding parts of the page or completely changing the layout. Advanced users can add their own tweaks, but most users will want to select some from the list of available Tweaks.
						    </div>
						    <div class="sfx_option" style="margin:10px 0;font-size:14px;"><input id="tweaks_enabled" type="checkbox" v-model="options.tweaks_enabled.newValue"/><label for="tweaks_enabled"></label> Tweaks enabled</div>
						    <div>
						        <input type="button" class="sfx_button" value="Create A New Tweak" @click="add_tweak">
						    </div>
						    <div v-if="tweaks.length" class="sfx_options_dialog_panel_header">Active Tweaks</div>
						    <table v-if="tweaks.length" class="sfx_options_dialog_table">
						        <thead>
						        <tr>
						            <th>Title</th>
						            <th>Description</th>
						            <th style="text-align:center;">Actions</th>
						            <th style="text-align:center;">Enabled</th>
						        </tr>
						        </thead>
						        <tbody>
						        <tr v-for="tweak in tweaks" v-bind:class="{'sfx_options_dialog_option_disabled':tweak.disabled}">
						            <td class="sfx_options_dialog_option_title">{{tweak.title}}<div v-if="tweak.id" style="font-weight:normal;font-style:italic;color:#999;margin-top:5px;">(Subscription)</div></td>
						            <td class="sfx_options_dialog_option_description">
						                {{tweak.description}}
						                <div v-if="tweak.id && tweak.subscription_last_updated_on" style="font-style:italic;color:#999;margin-top:5px;">Subscription last updated: {{ago(tweak.subscription_last_updated_on)}}</div>
						            </td>
						            <td class="sfx_options_dialog_option_action" style="white-space:nowrap;">
						                <span class="sfx_square_control" title="Edit" @click="edit_tweak(tweak,$index)">&#9998;</span>
						                <span class="sfx_square_control sfx_square_delete"  title="Delete" @click="delete_tweak(tweak)">&times;</span>
						            </td>
						            <td>
						                <input id="sfx_tweak_{{$index}}" type="checkbox" @change="toggle_tweak(tweak,$index)" v-model="tweak.enabled"/><label for="sfx_tweak_{{$index}}"></label>
						            </td>
						        </tr>
						        </tbody>
						    </table>

						    <div v-if="tweak_subscriptions">
						        <div class="sfx_options_dialog_panel_header">Available Display Tweaks (Snippets)</div>
						        <div>
						            Below is a list of display tweaks maintained by the Social Fixer team which you may find useful. When you add them to your list, they will be automatically updated to continue functioning if Facebook changes its layout or code.
						        </div>
						        <table class="sfx_options_dialog_table">
						            <thead>
						            <tr>
						                <th>Title</th>
						                <th>Description</th>
						                <th>Add</th>
						            </tr>
						            </thead>
						            <tbody>
						            <tr v-for="tweak in tweak_subscriptions" v-bind:class="{'sfx_tweak_subscribed':tweak.subscribed}">
						                <td class="sfx_options_dialog_option_title">{{tweak.title}}</td>
						                <td class="sfx_options_dialog_option_description">{{tweak.description}}</td>
						                <td class="sfx_options_dialog_option_action">
						                    <span class="sfx_square_add" title="Add To My Tweaks" @click="add_tweak_subscription(tweak)">+</span>
						                </td>
						            </tr>
						            </tbody>
						        </table>
						    </div>
						    <div v-else>
						        Loading Available Tweaks...
						    </div>
						</div>

						<div v-if="editing_tweak" class="sfx_options_dialog_panel">
						    <div class="sfx_panel_title_bar">Edit Tweak</div>
						    <div class="sfx_label_value">
						        <div>Title:</div>
						        <div><input class="sfx_wide" v-model="editing_tweak.title"></div>
						    </div>
						    <div class="sfx_label_value">
						        <div>Description: </div>
						        <div><input class="sfx_wide" v-model="editing_tweak.description"></div>
						    </div>
						    <div>CSS:<br/>
						        <textarea style="width:90%;height:250px;font-size:11px;font-family:monospace;" v-model="editing_tweak.css"></textarea>
						    </div>
						</div>
					</template>
					<template v-if="section.name=='About'"><div id="sfx_options_content_about">{{{content_about}}}</div></template>
					<template v-if="section.name=='Donate'">
						<div v-if="sfx_option_show_donate" style="margin-bottom:10px;">
							<input id="sfx_option_show_donate" type="checkbox" v-model="options.sfx_option_show_donate.newValue"/><label for="sfx_option_show_donate"></label> Remind me every so often to help support Social Fixer through donations.
						</div>
						<div id="sfx_options_content_donate">{{{content_donate}}}</div>
					</template>
					<template v-if="section.name=='Support'">
						<div style="font-family:monospace;font-size:11px;border:1px solid #ccc;margin-bottom:5px;padding:7px;">Browser: {{user_agent}}<br>Social Fixer 15.1.0 (greasemonkey)</div>
						<div id="sfx_options_content_support">{{{content_support}}}</div>
					</template>
					<template v-if="section.name=='Themes'"><div id="sfx_options_content_themes">{{{content_themes}}}</div></template>
				</template>
			</div>
		</div>
	</div>
</div>`;
			var close_options = function() {
				X('#sfx_options_dialog').remove();
			};
			X.subscribe('options/close',function() { close_options(); });

			var save_options = function() {
				var undef,opt,sectionName,key,options_to_save={};
				// Iterate each option
				for (key in FX.options) {
					opt = FX.options[key];
					// Only save non-default settings that have changed
					if (opt.newValue != opt.value) {
						// If it's the default, erase it from options so it will be overriden by the default
						if (opt.newValue==opt['default']) {
							options_to_save[key] = undef;
						}
						else {
							options_to_save[key]=opt.newValue;
						}
					}
					// Empty out the newValue
					opt.newValue=null;
				}
				// Store the data in memory
				X.storage.data.filters = X.clone(filters);
				X.storage.data.tweaks = X.clone(tweaks);

				// persist
				X.storage.set('options',options_to_save,function() {
					X.storage.save('filters',null,function() {
						X.storage.save('tweaks',null,function() {
							close_options();
							var position = X('#sfx_badge_menu').hasClass('right') ? 'right' : 'left';
							var note = sticky_note(X('#sfx_badge')[0], position, 'Saved!', {close: false});
							setTimeout(function () {
								note.remove();
							}, 2000);
						});
					});
				});
			};

			var key;
			if (event_data && event_data.data) {
				for (key in event_data.data) {
					data[key] = event_data.data[key];
				}
			}
			var methods = {
				"save":save_options
				,"cancel":function() {
					if (this.editing_filter) {
						this.action_button = null;
						this.editing_filter = null;
					}
					else if (this.editing_tweak) {
						this.action_button = null;
						this.editing_tweak = null;
					}
					else {
						close_options();
					}
				}
				,"collapse":function() {
					X('#sfx_options_dialog_body').toggle();
				}
				,"message": function(msg) {
					if (msg) {
						var messages = msg.split(/\s*,\s*/);
						if (messages && messages.length>0) {
							messages.forEach(function (m) {
								X.publish(m, {});
							});
						}
					}
				}
				,"select_section": function(section) {
					this.editing_filter=null;
					this.action_button = null;
					sections.forEach(function(s){s.selected=false;});
					section.selected = true;
					X.publish("menu/options/section",section.name);
				}
				,"ago":function(when) {
					return X.ago(when);
				}
				,"version_check":function(filter) {
					return (!filter.min_version || X.semver_compare(version,filter.min_version)>=0);
				}
				,"clear_test_regex":function(ev) {
					var input=X(ev.target);
					input.attr('data-hover',null).css('background-color','');
				}
				,"test_regex":function(ev) {
					var input=X(ev.target);
					try {
						var r = new RegExp(input.val());
						input.css('background-color','');
					}
					catch(e) {
						input.css('background-color','#e00');
						input.attr('data-hover','tooltip');
						input.attr('data-tooltip-content',"Invalid Regular Expression syntax: "+e.message);
						input.attr('data-tooltip-delay','1');
					}
				}
				,"populate_user_options":function() {
					this.user_options = X.clone(X.storage.data);
					this.user_options_message = null;
				}
				,"import_data":function() {
					var key,user_data, json = X('#sfx_user_data').val();
					var keys=[];
					this.user_options_message = null;
					try {
						user_data = JSON.parse(json);
						for (key in user_data) {
							var d = X.clone(user_data[key]);
							X.storage.data[key] = d;
							X.storage.save(key,null,function() {});
							keys.push(key);
						}
						this.user_options_message = "Successfully imported keys: " + keys.join(", ") + ". REFRESH THE PAGE IMMEDIATELY to activate the changes.";
						this.show_action_buttons=false;
					}catch(e) {
						this.user_options_message = "Error importing data: "+e.toString();
					}
				}
				,"reset_data":function() {
					if (confirm('Are you sure?\n\nResetting your data will ERASE all user preferences, "read" story data, installed filters, etc.')) {
						X.storage.save('options',{});
						X.storage.save('filters',[]);
						X.storage.save('tweaks',[]);
						X.storage.save('hiddens',{});
						X.storage.save('postdata',{});
						X.storage.save('friends',{});
						X.storage.save('stats',{});
						alert("All data has been reset. Please refresh the page.");
					}
				}
				// FILTERS
				,"edit_filter":function(filter,index) {
					this.editing_filter=X.clone(filter);
					this.editing_filter_index=index;
					this.action_button = 'done_editing_filter';
				}
				,"delete_filter":function(filter) {
					if (confirm('Are you sure you want to remove this filter?')) {
						this.filters.$remove(filter);
						mark_subscribed_filters(data.filter_subscriptions, filters);
					}
				}
				,"up":function(filter) {
					for (var i=0; i<this.filters.length; i++) {
						if (this.filters[i]==filter && i>0) {
							this.filters.$set(i,this.filters[i-1]);
							this.filters.$set(i-1,filter);
							return;
						}
					}
				}
				,"down":function(filter) {
					for (var i=0; i<this.filters.length; i++) {
						if (this.filters[i]==filter && i<this.filters.length-1) {
							this.filters.$set(i,this.filters[i+1]);
							this.filters.$set(i+1,filter);
							return;
						}
					}
				}
				,"close_filter":function() {
					this.editing_filter.updated_on = X.time();
					// If it's a subscription and actions are configurable and they have changed, flag as such
					var orig = this.filters[this.editing_filter_index];
					if (orig.id && orig.configurable_actions) {
						var original_actions = JSON.stringify(orig.actions);
						var new_actions = JSON.stringify(this.editing_filter.actions);
						if (original_actions!=new_actions) {
							// Updated actions!
							this.editing_filter.custom_actions = true;
						}
					}
					this.filters[this.editing_filter_index] = X.clone(this.editing_filter);
					this.editing_filter=null;
					this.action_button = null;
					mark_subscribed_filters(data.filter_subscriptions, filters);
				}
				,"add_filter":function() {
					var new_filter = {"match":"ALL","enabled":true,"stop_on_match":true,"rules":[{"target":"any","operator":"contains"}],"actions":[{"action":"hide"}]};
					new_filter.added_on = X.time();
					this.filters.push(new_filter);
					this.edit_filter(this.filters[this.filters.length-1],this.filters.length-1);
					this.action_button = 'done_editing_filter';
				}
				,"add_subscription":function(filter) {
					var f = X.clone(filter);
					f.enabled = true;
					if (!f.actions || !f.actions.length) {
						f.actions=[{"action":""}];
						f.configurable_actions = true;
					}
					this.filters.push(f);
					mark_subscribed_filters(data.filter_subscriptions, filters);
					//if (f.configurable_actions) {
					//	this.editing_filter = f;
					//	this.action_button = 'done_editing_filter';
					//}
				}
				,"add_condition":function() {
					this.editing_filter.rules.push({"target":"any","operator":"contains"});
				}
				,"delete_rule":function(rule) {
					this.editing_filter.rules.$remove(rule);
				}
				,"add_action":function() {
					this.editing_filter.actions.push({});
				}
				,"delete_action":function(action) {
					this.editing_filter.actions.$remove(action);
				}
				,"regex_test":function(condition) {
					var text = condition.text;
					var modifier = condition.modifier;
					X.publish("test/regex", {"text":text, "modifier":modifier});
				}
				// TWEAKS
				,"edit_tweak":function(tweak,index) {
					this.editing_tweak=X.clone(tweak);
					this.editing_tweak_index=index;
					this.action_button = 'done_editing_tweak';
				}
				,"delete_tweak":function(tweak) {
					if (confirm('Are you sure you want to remove this tweak?')) {
						this.tweaks.$remove(tweak);
						mark_subscribed_tweaks(data.tweak_subscriptions, tweaks);
					}
				}
				,"close_tweak":function() {
					this.editing_tweak.updated_on = X.time();
					if (this.editing_tweak.enabled) {
						X.css(this.editing_tweak.css, 'sfx_tweak_style_' + this.editing_tweak_index);
					}
					this.tweaks[this.editing_tweak_index] = X.clone(this.editing_tweak);
					this.editing_tweak=null;
					this.action_button = null;
				}
				,"add_tweak":function() {
					var new_tweak = {"title":"","description":"","enabled":true};
					new_tweak.added_on = X.time();
					this.tweaks.push(new_tweak);
					this.edit_tweak(this.tweaks[this.tweaks.length-1],this.tweaks.length-1);
					this.action_button = 'done_editing_tweak';
				}
				,"add_tweak_subscription":function(tweak) {
					var o = X.clone(tweak);
					o.enabled = true;
					this.tweaks.push(o);
					mark_subscribed_tweaks(data.tweak_subscriptions, tweaks);
					X.css(o.css,'sfx_tweak_style_'+this.tweaks.length-1);
				}
				,"toggle_tweak":function(tweak,index) {
					var css = tweak.enabled ? tweak.css : null;
					X.css( css,'sfx_tweak_style_'+index);
				}
			};
			template(document.body, dialog, data, methods).ready(function() {
				X.draggable('#sfx_options_dialog');

				// If a default section was passed in, publish that event
				if (event_data.section) {
					X.publish("menu/options/section",event_data.section);
				}
			});
		}catch(e) { alert(e); }
	}, true);

	X.subscribe("menu/options/section",function(msg,msgdata) {
		// If the section has dynamic data, load it
		sections.forEach(function(s) {
			if (s.name==msgdata && s.property && s.url) {
				X.ajax(s.url, function (content) { data[s.property] = X.sanitize(content); });
			}
		});
		if (msgdata=="Filters") {
			// Retrieve filters
			retrieve_filter_subscriptions(data.filters, function(subscriptions) {
				data.filter_subscriptions = subscriptions;
			});
		}
		if (msgdata=="Display Tweaks") {
			// Retrieve tweaks
			retrieve_tweak_subscriptions(data.tweaks, function(subscriptions) {
				data.tweak_subscriptions = subscriptions;
			});
		}
	});

	// If opening from an "options" url, open options immediately
	FX.on_content_loaded(function() {
		if (/sfx_options=true/.test(location.href)) {
			X.publish("menu/options");
		}
	});
});

// =====================================================
// Apply Filters to posts when they are added or updated
// =====================================================
// Filters depend on options, so wait until they load
FX.add_option('filters_enabled', {"section":"Filters","hidden":true,"default":true});
FX.add_option('filters_enabled_pages', {"section":"Filters","hidden":true,"default":false});
FX.add_option('filters_enabled_groups', {"section":"Filters","hidden":true,"default":false});
var sfx_post_data = {};
var sfx_filter_trace = {};
var filter_trace = function(id,msg) {
    sfx_filter_trace[id] = sfx_filter_trace[id] || [];
    sfx_filter_trace[id].push(msg);
};
X.subscribe("log/filter", function(msg,data) {
    filter_trace(data.id, data.message);
});

FX.on_options_load(function() {
    var show_filtering_disabled_message_displayed = false;
    var show_filtering_disabled_message = function() {
        if (show_filtering_disabled_message_displayed) { return; }
        show_filtering_disabled_message_displayed = true;
        var msg = "By default, post filtering only affects the News Feed.<br>You can change this in Options if you wish.";
        context_message("filter_disabled_message",msg,{"title":"Post Filtering Disabled"});
    };
    FX.on_page_unload(function() { show_filtering_disabled_message_displayed=false; });

    var filters = FX.storage('filters');
	var filter_post = function(msg,data) {
	    // If this is a permalink (single story) page, don't run any filters
        if (X('html').attr('sfx_context_permalink')=="true") {
            return;
        }

		var post = data.dom;
        var dom_id = data.id;
        var post_data;

        post_data = sfx_post_data[dom_id];
		if (msg=="post/add") {
            sfx_post_data[dom_id] = {"sfx_id": data.sfx_id, "dom_id": dom_id, "id":dom_id };
            post_data = sfx_post_data[dom_id];
            sfx_filter_trace[dom_id] = [];
        }
        else {
            // In case of update, sfx_id might have been set
            if (data.sfx_id && !post_data.sfx_id) {
                post_data.sfx_id = data.sfx_id;
            }
        }

        // Before filtering this post, check to see where it lives and if we should filter it
        var filtering_disabled = false;
        if (!FX.option('filters_enabled_pages') && (post.is(selector_timeline) || post.is(selector_page))) {
            filter_trace(dom_id,"Not filtering post because filtering is disabled on Pages/Timelines");
            filtering_disabled = true;
            show_filtering_disabled_message();
            return;
        }
        if (!FX.option('filters_enabled_groups') && (post.is(selector_group))) {
            filter_trace(dom_id,"Not filtering post because filtering is disabled in Groups");
            filtering_disabled = true;
            show_filtering_disabled_message();
            return;
        }

		var extract_data = extract_post_data(post,post_data,filters);
        // Only re-run filters if the extracted data changed
        if (msg=="post/add" || (extract_data && JSON.stringify(post_data)!=JSON.stringify(extract_data))) {
            for (var k in extract_data) {
                post_data[k] = extract_data[k];
            }
            // Disable all filtering in some groups (support, etc)
            if (FX.context.type == "groups" && FX.option('filters_enabled_groups')) {
                if (/^(412712822130938|164440957000149|551488248212943|SFxSnipDev|SocialFixerSupportTeam|SocialFixerUserSupport)$/.test(FX.context.id)) {
                    var msg = "Social Fixer automatically disables filtering in support groups,<br>to avoid confusion from posts not showing.<br>Your filters will not be applied here.";
                    context_message("filter_disabled_in_support_message",msg,{"title":"Post Filtering Disabled"});

                    return false;
                }
            }
            apply_filters(post, post_data, filters);
        }
	};

    // Only filter posts if filtering is enabled
    if (FX.option('filters_enabled') && filters && filters.length>0) {
        X.subscribe("post/add", filter_post, true);
        X.subscribe("post/update", filter_post, false);
    }

});


var extract = {
    "author":function(o,data) {
        var a = o.find('a[data-hovercard*="id="]').filter(function(){ return (X(this).find('img').length==0); }).first();
        if (a.length) {
            var hc = a.attr('data-hovercard');
            data.author = a[0].innerHTML;
            // Store a reference to the author link itself
            data.authorContent=[a];
        }
    },
    "link_url":function(o,data) {
        data.link_url = "";
        var a = o.find('a[onmouseover^="LinkshimAsyncLink.swap"]');
        a.forEach(function(a) {
            a = X(a);
            var url = a.attr('onmouseover');
            if (!url) { return; }
            if (url) {
                url = url.replace(/^.*?"(.*?)".*/,"$1").replace(/\\\//g,"/");
            }
            data.link_url+=" "+url;
        });
    },
    "link_text":function(o,data) {
        // Look for an attachment image
        data.link_text = o.find('.fbStoryAttachmentImage').closest('a').parent().next().text();
    },
    "type":function(o,data) {

    },
    "content":function(o,data) {
        var str = "";
        // Store a reference to all userContent areas, in case we need to manipulate them (replace text, etc)
        data.userContent=[];
        o.find('.userContent').forEach(function(el) {
            el = X(el);
            str += el.innerText()+' !!! ';
            data.userContent.push(el);
        });
        // If there is no userContent, try the wrapper
        if (str=="") {
            o.find('.userContentWrapper').forEach(function(el) {
                el = X(el);
                str += el.innerText()+' ';
                data.userContent.push(el);
            });
        }
        data.content = str;
    },
    "action":function(o,data) {
        var str = "";
        // Store a reference to all actionContent areas, in case we need to manipulate them (replace text, etc)
        data.actionContent=[];
        o.find('.userContentWrapper h5').forEach(function(el) {
            el = X(el);
            str += el.text()+' ';
            data.actionContent.push(el);
        });
        data.action = str;
    },
    "app":function(o,data) {
        data.app = o.find('a[data-appname]').attr('data-appname');
    }
};

// Util method to replace text content in text nodes
function replaceText(rootNode,find,replace) {
    var children = rootNode.childNodes;
    for(var i = 0; i < children.length; i++) {
        var aChild = children[i];
        if(aChild.nodeType == 3) {
			var storedText = '';
			// If the parent node has an attribute storing the text value, check it to see if it's changed.
			// This is a method to prevent text replace actions from triggering another mutation event and repeatedly changing the same text.
			// This really only happens if the replace text is a superset of the find text.
			if (aChild.parentNode) {
				storedText = aChild.parentNode.getAttribute('sfx_node_text') || '';
			}
			var nodeValue = aChild.nodeValue;
			if (nodeValue!=storedText) {
				var newVal = nodeValue.replace(find,replace);
				if (newVal!=nodeValue) {
					aChild.nodeValue = newVal;
					aChild.parentNode.setAttribute('sfx_node_text',newVal);
				}
			}
        }
        else {
            replaceText(aChild,find,replace);
        }
    }
}

// Run filters to take actions on a post
function apply_filters(post,data,filters) {
    if (!filters || filters.length==0) { return; }
    var match = false;
    filter_trace(data.id,`BEGIN Filtering`);
    for (var i=0; i<filters.length; i++) {
        var filter = filters[i];
        if (filter.enabled===false) {
            filter_trace(data.id,`Filter #${i+1} (${filter.title}) Disabled`);
            continue;
        }
        filter_trace(data.id,`Filter #${i+1} (${filter.title})`);
        if (apply_filter(post,data,filter)) {
            match = true;
            if (filter.stop_on_match) {
                filter_trace(data.id,`Filter processing stopped because "Stop on Match" is active`);
                break;
            }
        }
    }
    filter_trace(data.id,`END Filtering. Filtered=${match}`);
    return match;
}

// Execute a single filter on a post
function apply_filter(post,data,filter) {
    if (!filter || !filter.rules || !filter.rules.length>0 || !filter.actions || !filter.actions.length>0) {
        return false;
    }
    var all_match = true;
    var any_match = false;
    filter.rules.forEach(function(rule) {
        try {
            if (any_match && "ANY" === filter.match) {
                return; // Already matched a condition
            }
            if (!all_match && "ALL"===filter.match) {
                return; // Already failed on one rule, don't continue
            }
            var match = false;
            var operator = rule.operator;
            // The "selector" rule isn't text-based, special case to handle first
            if ("contains_selector" == operator) {
                filter_trace(data.id, " -> Looking for selector: " + rule.condition.text);
                if (post.find(rule.condition.text).length > 0) {
                    match = true;
                    filter_trace(data.id, " -> Found!");
                }
            }
            else {
                var target = "";
                if (rule.target == "any") {
                    for (var type in extract) {
                        if (typeof data[type] == "string" && type!="link_url") {
                            target += (" " + data[type]);
                        }
                    }
                }
                else {
                    target = data[rule.target];
                }
                if (!target) {
                    filter_trace(data.id, " -> Rule target doesn't exist (yet): "+rule.target);
                    all_match = false;
                    return false;
                }
                if ("equals" == operator) {
                    match = new RegExp("^" + rule.condition.text + "$").test(target);
                }
                else if ("contains" == operator) {
                    if (rule.match_partial_words) {
                        var regex = new RegExp(rule.condition.text, "i");
                    }
                    else {
                        var regex = new RegExp("(?:^|\\b)" + rule.condition.text + "(?:\\b|$)", "i");
                    }
                    filter_trace(data.id, " -> Testing RegExp: " + regex.toString());
                    var results = regex.exec(target);
                    if (results != null) {
                        match = true;
                        data.regex_match = results;
                    }
                    filter_trace(data.id, match ? " -> Matched Text: '" + RegExp.lastMatch + "'" : "No match");
                }
                else if ("startswith" == operator) {
                    var regex = RegExp("^" + rule.condition.text, "i");
                    filter_trace(data.id, " -> Testing RegExp: " + regex.toString());
                    match = regex.test(target);
                    filter_trace(data.id, match ? " -> Matched Text: '" + RegExp.lastMatch + "'" : "No match");
                }
                else if ("endswith" == operator) {
                    var regex = new RegExp(rule.condition.text + "$", "i");
                    filter_trace(data.id, " -> Testing RegExp: " + regex.toString());
                    match = regex.test(target);
                    filter_trace(data.id, match ? " -> Matched Text: '" + RegExp.lastMatch + "'" : "No match");
                }
                else if ("contains_in" == operator) {
                    var conditions = rule.condition.text.split(/\s*,\s*/);
                    conditions.forEach(function (condition) {
                        if (!match && new RegExp(condition, "i").test(target)) {
                            match = true;
                        }
                    });
                }
                else if ("in" == operator) {
                    var conditions = rule.condition.text.split(/,/);
                    conditions.forEach(function (condition) {
                        if (!match && new RegExp("^" + condition + "$", "i").test(target)) {
                            match = true;
                        }
                    });
                }
                else if ("matches" == operator) {
                    var regex = new RegExp(rule.condition.text, (rule.condition.modifier || ''));
                    filter_trace(data.id, "Testing RegExp: " + regex.toString());
                    var results = regex.exec(target);
                    if (results != null) {
                        match = true;
                        data.regex_match = results;
                    }
                    filter_trace(data.id, match ? " -> Matched Text: '" + RegExp.lastMatch + "'" : "No match");

                }
            }
            if (match) {
                any_match = true;
            }
            else if (all_match) {
                all_match = false;
            }
        } catch(e) {
            filter_trace(data.id, "ERROR: "+e.message);
        }
    });

    // Were enough rules satisfied to execute the actions?
    if (!any_match || (filter.match=="ALL" && !all_match)) { return false; }

    // Filter matched! Execute the actions
    filter.actions.forEach(function(action) {
        apply_action(post,data,action,filter);
    });

    // Filter matched
    return true;
}

// Apply a single filter action to a post
function apply_action(post,data,action,filter) {
    if ("class"==action.action) {
        filter_trace(data.id,`Applying CSS class '${action.content}'`);
        post.addClass(action.content);
    }
    else if ("css"==action.action) {
        var rules = action.content.split(/\s*;\s*/);
        filter_trace(data.id,`Applying CSS '${action.content}'`);
        rules.forEach(function(rule) {
            var parts = rule.split(/\s*:\s*/);
            if (parts && parts.length>1) {
                post.css(parts[0], parts[1]);
            }
        })
    }
    else if ("replace"==action.action) {
        filter_trace(data.id,`Replacing '${action.find}' with '${action.replace}'`);
        if (data.userContent) {
            data.userContent.forEach(function(usercontent) {
                replaceText(usercontent[0], new RegExp(action.find,"gi"), action.replace);
            });
        }
        if (data.authorContent) {
            data.authorContent.forEach(function(authorcontent) {
                replaceText(authorcontent[0], new RegExp(action.find,"gi"), action.replace);
            });
        }
    }
    else if ("hide"==action.action) {
        if (!post.hasClass('sfx_filter_hidden')) {
            post.addClass("sfx_filter_hidden");
            filter_trace(data.id,`Hiding Post`);
            if (action.show_note) {
                post.prepend(filter_hidden_note(filter, action));
            }
        }
    }
    else if ("move-to-tab"==action.action) {
        var tab_name = regex_replace_vars(action.tab, data.regex_match);
        filter_trace(data.id,`Moving to tab '${tab_name}'`);
        X.publish("filter/tab/move", {"tab":tab_name, "post":post,"data":data} );
    }
    else if ("copy-to-tab"==action.action) {
        var tab_name = regex_replace_vars(action.tab, data.regex_match);
        filter_trace(data.id,`Copying to tab '${tab_name}'`);
        X.publish("filter/tab/copy", {"tab":tab_name, "post":post,"data":data} );
    }
}

function regex_replace_vars(str, matches) {
    if (!str || !matches || !matches.length) { return str; }
    return str.replace(/\$(\d+)/g, function(m) {
        var i = m[1];
        if (i<matches.length) {
            return matches[i];
        }
        return "";
    });
}

function filter_hidden_note(filter, action) {
    var css = action.css || '';
    if (action.custom_note) {
        var note = X(`<div class="sfx_filter_hidden_note" style="${css}">${action.custom_note}</div>`);
    }
    else {
        var note = X(`<div class="sfx_filter_hidden_note" style="${css}">Post hidden by filter "${filter.title}". Click to toggle post.</div>`);
    }
    note.on('click',function() {
       note.closest('*[sfx_post]').toggleClass('sfx_filter_hidden_show');
    });
    return note;
}

// Parse content in a post to pull out chunks of data we might want to filter on
function extract_post_data(post,post_data,filters) {
    post_data = post_data ? X.clone(post_data) : {};
    for (var type in extract) {
        extract[type](post,post_data);
    }
    return post_data;
}

// Add actions to the post action tray
X.publish('post/action/add',{"section":"filter","label":"Edit Filters","message":"menu/options","data":{"section":"Filters"}});
X.publish('post/action/add',{"section":"filter","label":"Filter Debugger","message":"post/action/filter/debug"});
X.subscribe('post/action/filter/debug',function(msg,data) {
    var data_content = JSON.stringify(sfx_post_data[data.id],null,3);
    var trace = sfx_filter_trace[data.id];
    var trace_content = trace ? trace.join('<br>') : 'No Trace';
    var content = `
        <div>This popup gives details about how this post was processed for filtering.</div>
        <div draggable="false" class="sfx_bubble_note_subtitle">Filtering Trace</div>
        <div draggable="false" class="sfx_bubble_note_data">${trace_content}</div>
        <div draggable="false" class="sfx_bubble_note_subtitle">Raw Extracted Post Data</div>
        <div draggable="false" class="sfx_bubble_note_data">${data_content}</div>
    `;
    var note = bubble_note(content,{"position":"top_right","title":"Post Filtering Debug","close":true});
});
// =====================================
// Post Filter: Move/Copy To Tab
// =====================================
FX.add_option('always_show_tabs', {
    "section":"Advanced"
    ,"title":"Always Show Tab List"
    ,"description":"Always show the list of Tabs in the Control Panel, even if no posts have been moved to tabs yet."
    ,"default":false
});
var $tab_vm=null, tab_data, all_posts, unfiltered_posts, processed_posts, tab_list_added;
var reset = function() {
    tab_data = {
        "post_count":0,
        "post_count_read":0,
        "filtered_count":0,
        "filtered_count_read":0,
        "tabs": {

        },
        "selected_tab": null,
        "show_all":false
    };
    all_posts = {};
    unfiltered_posts = {};
    processed_posts = {};
    tab_list_added = false;
};
reset();
FX.on_page_unload(reset);
// When a post is hidden because it was 'read', update tab counts
X.subscribe("post/hide_read", function(msg,data) {
    var id = data.id, key;
    // Look for this post in all the tabs to increase the "read count"
    for (key in tab_data.tabs) {
        if (typeof tab_data.tabs[key].posts[id]!="undefined") {
            // This post exists in this tab
            tab_data.tabs[key].read_count++;
        }
    }
    if (typeof unfiltered_posts[id]!="undefined") {
        tab_data.filtered_count_read++;
    }
    if (typeof all_posts[id]!="undefined") {
        tab_data.post_count_read++;
    }
});
// When a post is unhidden because it was 'unread', update tab counts
X.subscribe("post/unhide_read", function(msg,data) {
    var id = data.id, key;
    // Look for this post in all the tabs to decrease the "read count"
    for (key in tab_data.tabs) {
        if (typeof tab_data.tabs[key].posts[id]!="undefined") {
            // This post exists in this tab
            tab_data.tabs[key].read_count--;
        }
    }
    if (typeof unfiltered_posts[id]!="undefined") {
        tab_data.filtered_count_read--;
    }
    if (typeof all_posts[id]!="undefined") {
        tab_data.post_count_read--;
    }
});
var remove_post_from_other_tabs = function(dom_id,is_read) {
    // Look for this post in all the tabs
    var key;
    for (key in tab_data.tabs) {
        if (typeof tab_data.tabs[key].posts[dom_id]!="undefined") {
            // This post exists in this tab
            delete tab_data.tabs[key].posts[dom_id];
            //tab_data.tabs[key].read_count -= (is_read?1:0);
            tab_data.tabs[key].post_count--;
        }
    }
    if (typeof unfiltered_posts[dom_id]!="undefined") {
        delete unfiltered_posts[dom_id];
        tab_data.filtered_count--;
        tab_data.filtered_count_read -= (is_read?1:0);
    }
};
// Move to the next tab in the list
X.subscribe("filter/tab/next", function(msg,data) {
    if (!$tab_vm) { return; }
    // Get the list of tab names, in order
    var keys = Object.keys(tab_data.tabs).sort( function(a,b){ return a>b; } );
    for (var i=0; i<keys.length-1; i++) {
        if (tab_data.tabs[keys[i]].selected) {
            for (var j=i+1; j<keys.length; j++) {
                if (tab_data.tabs[keys[j]].read_count < tab_data.tabs[keys[j]].post_count) {
                    $tab_vm.select_tab( tab_data.tabs[keys[j]] );
                    return;
                }
            }
            return;
        }
    }
});
var create_tab_container = function(tablist) {
    if (tab_list_added || X.find('#sfx_cp_filter_tabs')) { return; }
    tab_list_added = true;
    X.publish("cp/section/add", {
        "name":'Filter Tabs <span class="sfx_count">(unread / total)</span>'
        ,"id":"sfx_cp_filter_tabs"
        ,"order":50
        ,"help":"The Filtered Feed shows the filtered view of the feed, with posts removed that have been moved to tabs.\n\nThe All Posts view shows every post in the feed, even if it has been filtered to a tab."
    });
    var html = `<div class="sfx_cp_tabs" style="max-height:60vh;overflow:auto;">
                    <div v-if="post_count!=filtered_count" v-bind:class="{'selected':(!show_all&&!selected_tab)}" class="sfx_filter_tab" @click="select_filtered()">Filtered Feed <span class="sfx_count">(<span class="sfx_unread_count" v-if="filtered_count_read>0">{{filtered_count-filtered_count_read}}/</span>{{filtered_count}})</span></div>
                    <div v-bind:class="{'selected':(show_all&&!selected_tab)}" class="sfx_filter_tab" @click="select_all()">All Posts <span class="sfx_count">(<span class="sfx_unread_count" v-if="post_count_read>0">{{post_count-post_count_read}}/</span>{{post_count}})</span></div>
                    <div v-for="tab in tabs | orderBy 'name'" class="sfx_filter_tab" v-bind:class="{'selected':tab.selected}" @click="select_tab(tab)">{{tab.name}} <span class="sfx_count">(<span class="sfx_unread_count" v-if="tab.read_count>0">{{tab.post_count-tab.read_count}}/</span>{{tab.post_count}})</span></div>
                </div>`;
    var methods = {
        "select_tab":function(tab) {
            if (tab_data.selected_tab) {
                tab_data.selected_tab.selected = false;
            }
            tab_data.selected_tab = tab;
            tab.selected = true;
            X(`*[sfx_post]`).each(function () {
                var $post = X(this);
                if (typeof tab.posts[$post.attr('id')] != "undefined") {
                    $post.removeClass('sfx_filter_tab_hidden');
                }
                else {
                    $post.addClass('sfx_filter_tab_hidden');
                }
            });
            FX.reflow(true);
        },
        "select_all":function() {
            if (this.selected_tab) {
                this.selected_tab.selected = false;
            }
            this.selected_tab = null;
            this.show_all = true;
            X(`*[sfx_post]`).each(function() {
                X(this).removeClass('sfx_filter_tab_hidden');
            });
            FX.reflow(true);
        },
        "select_filtered":function() {
            if (this.selected_tab) {
                this.selected_tab.selected = false;
            }
            this.selected_tab = null;
            this.show_all = false;

            X(`*[sfx_post]`).each(function() {
                var $post = X(this);
                if (typeof unfiltered_posts[$post.attr('id')]!="undefined") {
                    $post.removeClass('sfx_filter_tab_hidden');
                }
                else {
                    $post.addClass('sfx_filter_tab_hidden');
                }
            });
            FX.reflow(true);
        }
    };
    // Wait until the section is added before adding the content
    Vue.nextTick(function() {
        var v = template('#sfx_cp_filter_tabs', html, tab_data, methods);
        $tab_vm = v.$view; // The Vue instance, to access the $set method below

        // Wait til next tick to add tabs, if passed
        if (tablist) {
            Vue.nextTick(function() {
                tablist.forEach(function (t) {
                    create_tab(t);
                });
            });
        }
    });
};

// When the page first loads, optionally show the tab container by default if any tab filters are defined
FX.on_options_load(function() {
    if (FX.option('filters_enabled') && FX.option('always_show_tabs')) {
        var tab_list_added = false;
        var tabs = [];
        var show = false;
        // Only show the tab list if there are actual tabbing filters
        (FX.storage('filters') || []).forEach(function (filter) {
            if (!filter.enabled) {
                return;
            }
            (filter.actions || []).forEach(function (action) {
                if ((action.action == "copy-to-tab" || action.action == "move-to-tab") && action.tab!="$1") {
                    tabs.push(action.tab);
                    show = true;
                }
            })
        });
        if (show) {
            X.subscribe("post/add", function () {
                if (!tab_list_added && X('html').attr('sfx_context_permalink') != "true") {
                    create_tab_container(tabs);
                    tab_list_added = true;
                }
            });
            FX.on_page_unload(function() {
                tab_list_added = false;
            });
        }
    }
});

var create_tab = function(tabname) {
    Vue.set(tab_data.tabs,tabname, {"name": tabname, "posts": {}, "selected": false, "post_count": 0, "read_count":0});
};

var add_to_tab = function(tabname, dom_id, post, copy) {
    if (!tab_data.tabs[tabname]) {
        create_tab(tabname);
    }

    var is_read = post.hasClass('sfx_post_read')?1:0;
    // If moving, first remove the post from other tabs
    if (!copy) {
        remove_post_from_other_tabs(dom_id, is_read);
    }

    // Add the post to the new tab
    Vue.set(tab_data.tabs[tabname].posts, dom_id, {});

    tab_data.tabs[tabname].post_count++;
    // If this post has already been marked as read, increment the read_count now, because it won't be ticked later
    tab_data.tabs[tabname].read_count += is_read;

    // Show or Hide the post depending on what we are looking at now and where it should go
    if (!tab_data.selected_tab && !copy) { // Currently Showing the news feed, post shouldn't be here because it is moved to tab
        post.addClass('sfx_filter_tab_hidden');
    }
    else if (tab_data.selected_tab && tab_data.selected_tab.name == tabname) { // Showing a tab and the post belongs here
        post.removeClass('sfx_filter_tab_hidden');
    }
    else if (tab_data.selected_tab==null && copy){ // Showing the filtered feed, but the post should stay in the filtered feed too
        post.removeClass('sfx_filter_tab_hidden');
    }
    else {

    }
};
X.subscribe(["filter/tab/move","filter/tab/copy"],function(msg,data) {
    try {
        var dom_id = data.data.dom_id;
        var tab_name = data.tab;
        var key = dom_id + dom_id+"/"+tab_name;
        // Check to see if post has already been processed to this tab, to avoid double-processing
        if (typeof processed_posts[key] == "undefined") {
            processed_posts[key] = true;
            create_tab_container();
            Vue.nextTick(function() {
                add_to_tab(tab_name, dom_id, data.post, msg == "filter/tab/copy");
            });
        }
        else {
        }
    }catch(e) { alert(e); }
});
// When new posts are added, if a tab is selected, hide them so the filter can decide whether to show them
X.subscribe("post/add",function(msg,data) {
    tab_data.post_count++;
    if (tab_data.selected_tab) {
        data.dom.addClass('sfx_filter_tab_hidden');
    }
    tab_data.filtered_count++;
    all_posts[data.id] = {};
    unfiltered_posts[data.id] = {};
});

// News Feed: id = hyperfeed_story_id_5605f5aa3e0ae5300811688
// Timeline: id = tl_unit_-2124908222973793679
// Group: id = mall_post_764394977004741:6
// Page: data-ft*="top_level_post_id"
var selector_news_feed = '*[id^="hyperfeed_story_id_"]';
var selector_timeline = '*[id^="tl_unit_"]';
var selector_group = '*[id^="mall_post_"]';
var selector_page = 'div[data-ft*="top_level_post_id"]';
var post_selector = [selector_news_feed,selector_timeline,selector_group,selector_page].join(',');

var sfx_post_selector = '*[sfx_post]';
var sfx_post_id = 1;
var max_posts = 50;
var post_count = 0;
var pager_selector = '#pagelet_group_pager, #www_pages_reaction_see_more_unit, *[data-testid="fbfeed_placeholder_story"] ~ a';

// CODE FOR DEBUGGING LAZY INSERTION OF POST CONTENT
/*
FX.css(`
.sfx_insert_step_1 { margin:5px; outline:2px solid red; }
.sfx_insert_step_2 { margin:5px; outline:2px solid green; }
.sfx_insert_step_3 { margin:5px; outline:2px solid blue; }
.sfx_insert_step_4 { margin:5px; outline:2px solid orange; }
.sfx_insert_step_4 { margin:5px; outline:2px solid purple; }
.sfx_insert_step_4 { margin:5px; outline:2px solid lime; }
.sfx_insert_step_4 { margin:5px; outline:2px solid cyan; }
`);
*/

// When options are loaded, update the max posts value
FX.add_option('max_post_load_count',{"section":"Advanced","title":'Post Auto-Loading',"description":'How many posts should be allowed to load before being paused.',"type":"text","default":max_posts});
FX.on_options_load(function() {
	max_posts = +FX.option('max_post_load_count') || max_posts;
});

// When the page is first loaded, scan it for posts that exist as part of the static content
FX.on_content_loaded(function() {
	setTimeout(function() {
		// Find and handle inserted posts
		FX.on_content_inserted(function(o) {
			// If the inserted node lives within a <form> then it's in the reaction part of the post, we don't need to re-process
			if (o.closest('form').length) { return; }

			var posts = find_and_process_posts(o);
			// If no posts processed, just part of a post may have been inserted, we need to check
			if (!posts || !posts.length) {

				var post = o.closest(sfx_post_selector);
				if (post.length==1) {

					// DEBUGGING!!!!!!!
					/*
					var step = +post.attr('sfx_step') || 0;
					step++;
					post.attr('sfx_step',step);
					o.addClass("sfx_insert_step_"+step);
					*/

					var id = post.attr('id');
					// The inserted content was inside of a post container
					// Process the post. If it's already been done, it will just exit
					process_post(id);
					var sfx_id = post.attr('sfx_id');

					X.publish("log/postdata",{"id":id,"message":"Calling post/update"});
					X.publish("post/update", {"id":id,"sfx_id":sfx_id,"dom":post},false,true); // Do not persist update messages
				}
			}
		});

		find_and_process_posts(X(document.body));

	},500);
});

// FOR TESTING/DEBUGGING
//FX.css('*[sfx_id]:before { content:attr(sfx_id) "/" attr(id); white-space:pre; font-family:monospace; }');

// Find and identify posts within any DOM element
// This can be fired at document load, or any time content is inserted.
function find_and_process_posts(container) {
	var posts = container.find(post_selector);
	if (container.is(post_selector)) {
		posts = posts.add(container);
	}
	posts.each(function(i,post) {
		var $post = X(post);
		// Delay the processing of each post so it is async
		// The post may have internal DOM updates before it's processed, so we avoid processing the post multiple times
		setTimeout(function () {
			process_post($post.attr('id'));
		}, 20);
	});
    return posts;
}

// Do the initial process a post and mark it as being seen by SFX
function process_post(id) {
	var $post = X(document.getElementById(id)); // Group posts have : in the id, which causes Zepto to crash

	// Sometimes an empty post container gets inserted, then removed and re-inserted with content
	// Before processing a container, make sure it's not just a shell
	X.publish("log/postdata",{"id":id,"message":"processing post id="+id});

	// The initial processing recognizes a post and marks it as such
	var is_new = false;
	if (!$post.attr('sfx_post')) {
		$post.attr('sfx_post', sfx_post_id++); // Mark this post as processed
		X.publish("log/postdata",{"id":id,"message":"sfx_post="+$post.attr('sfx_post')});
		is_new = true;
	}
	// Check for the sfx_id, which is a post's unique identifier to SFX
	var sfx_id = $post.attr('sfx_id');
	if (!sfx_id) {
		sfx_id = get_post_id($post);
		if (sfx_id) {
			X.publish("log/postdata",{"id":id,"message":"found sfx_id="+sfx_id});
			$post.attr('sfx_id', sfx_id);
		}
	}

	var data = {
		"id":id
		,"dom":$post
		,"sfx_id":sfx_id
	};

	if (is_new) {
		X.publish("log/postdata", {"id": id, "message": "Calling post/add"});
		X.publish("post/add", data);

		// If we have processed too many posts, stop here
		if (post_count++ > max_posts) {
			var pager = X(pager_selector);
			if (pager.is('a')) {
				pager = pager.parent();
			}
			if (!pager.hasClass('sfx-pager-disabled')) {
				var newpager = X('<div class="sfx_info sfx-pager" style="cursor:pointer;">Social Fixer has paused automatic loading of more than ' + max_posts + ' posts to prevent Facebook from going into an infinite loop. <b>Click this message</b> to continue loading ' + max_posts + ' more posts.<br><i>(The number of posts to auto-load is configurable in the Advanced tab in Options)</i></div>');
				try {
					newpager.click(function () {
						newpager.remove();
						pager.removeClass('sfx-pager-disabled');
						post_count = 0;
						setTimeout(function () {
							FX.reflow(false);
							X.ui.scroll(3);
						}, 100);
					});
				} catch (e) {
					alert(e);
				}
				pager.first().before(newpager);
				pager.addClass('sfx-pager-disabled');
				setTimeout(function () {
					X.ui.scroll(3);
				}, 100);
			}
		}
	}
}

// When navigating, reset post count
FX.on_page_unload(function() {
	sfx_post_id=1;
	post_count = 0;
});

var regex_fbid = /fbid=(\d+)/;
var regex_post = /\/(?:posts|videos|permalink)\/(\d+)/;
var regex_gallery = /\/photos\/\w\.[\d\.]+\/(\d+)/;
function get_post_id($post) {
	var id = $post.attr('id');
	var href = $post.find('abbr.timestamp,abbr[data-utime][title]').parent().attr('href');
	if (href) {
		if (regex_fbid.test(href) || regex_post.test(href) || regex_gallery.test(href)) {
			X.publish("log/postdata",{"id":id,"message":"get_post_id="+RegExp.$1});
			return RegExp.$1;
		}
		X.publish("log/postdata",{"id":id,"message":"get_post_id="+href});
		return href;
	}
	X.publish("log/postdata",{"id":id,"message":"get_post_id=null"});
	return null;
}

X.subscribe("test/regex", function(msg,data) {
    var text = data.text || '';
    var modifier = data.modifier || '';
   var content=`
        <div draggable="false">Mozilla Developer Network: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions" target="_blank">Regular Expressions Documentation</a></div>
        <div draggable="false" class="sfx_label_value">
            <div>Expression: </div>
            <div><input id="sfx_regex_tester_expression" size="25" value="${text}"></div>
        </div>
        <div draggable="false" class="sfx_label_value">
            <div>Modifiers: </div>
            <div><input id="sfx_regex_tester_modifier" size="5" value="${modifier}"> [ g i m ]</div>
        </div>
        <div draggable="false"><b>Test String:</b><br>
            <textarea id="sfx_regex_tester_string" style="width:250px;height:75px;"></textarea>
        </div>
        <div draggable="false">
            <input type="button" class="sfx_button" value="Test" onclick="document.getElementById('sfx_regex_tester_results').innerHTML=document.getElementById('sfx_regex_tester_string').value.replace(new RegExp('('+document.getElementById('sfx_regex_tester_expression').value+')',document.getElementById('sfx_regex_tester_modifier').value),'<span style=&quot;background-color:cyan;font-weight:bold;&quot;>$1</span>');">        
        </div>
        <div draggable="false">
            <div><b>Results:</b></div>
            <div id="sfx_regex_tester_results" style="white-space:pre;"></div>
        </div>

    `;
    bubble_note(content, {"position":"top_right","title":"Regular Expression Tester","close":true});
});
// =========================================================
// Remove Columns
// =========================================================
FX.add_option('remove_left_column',{"section":"User Interface","title":'Remove Left Column',"description":'Remove the left column of shortcuts and make the news feed a bit wider',"default":false});
FX.on_options_load(function() {
    var cn="hasLeftCol";
    if (FX.option('remove_left_column')) {
        X.when('body',function($body) {
            $body.removeClass(cn);
            X.on_attribute_change($body[0], 'class', function() {
                if ($body.hasClass("SettingsPage")) {
                    $body.addClass(cn);
                }
                else {
                    $body.removeClass(cn);
                }
            });
        });
    }
});

FX.add_option('remove_ticker_sidebar',{"section":"User Interface","title":'Remove Sidebar',"description":'Remove the "ticker" sidebar on the right side.',"default":false});
FX.on_options_load(function() {
    var html = null;
    if (FX.option('remove_ticker_sidebar')) {
        X.poll(function () {
            if (!html || html.length==0) { html = X('html'); }
            if (html && html.length && html.hasClass('sidebarMode')) {
                html.removeClass('sidebarMode');
            }
            return false;
        },100,100);
    }
});

FX.add_option('remove_right_column',{"section":"User Interface","title":'Remove Right Column',"description":'Remove the right column of widgets and make the news feed a bit wider',"default":false});
FX.on_options_load(function() {
    var contentCol = null;
    if (FX.option('remove_right_column')) {
        FX.css("#rightCol { display:none !important; }");
        X.poll(function () {
            if (!contentCol || contentCol.length==0) { contentCol = X('#contentCol'); }
            if (contentCol && contentCol.length && contentCol.hasClass('hasRightCol')) {
                contentCol.removeClass('hasRightCol');
            }
            return false;
        },100,100);
    }
});

// =========================================================
// "Stealth" Mode
// =========================================================
FX.add_option('stealth_mode',{"title":'Stealth Mode',"description":'Stealth Mode is a simple toggle in the wrench menu that hides or shows things you might accidentally click on when you don\'t mean to. It hides "Like" and "Add Friend" links and buttons, "Comment" fields, etc.',"default":true});

FX.on_options_load(function() {
	if (FX.option('stealth_mode')) {
		var menu_item = {"html":'Enable "Stealth Mode"',"message":"stealth/toggle","tooltip":"Hide comment input, Like buttons, Add Friend buttons, and other controls so you don't accidentally click on them."};
		X.publish("menu/add", {"section":"actions","item":menu_item});

		var stealth_mode_enabled = false;
		X.subscribe("stealth/toggle", function() {
			stealth_mode_enabled = !stealth_mode_enabled;
			menu_item.html = stealth_mode_enabled ? 'Disable "Stealth Mode"' : 'Enable "Stealth Mode"';
			X('html').toggleClass("sfx_stealth_mode", stealth_mode_enabled);
		});
	}
});

// ===================================================
// STICKY NOTES
// ===================================================
// o = Object to point to
// position = left | right
// content = stuff in the note
// pref = ?
// closefunc = ?
// opts = ?
function sticky_note(o,position,content,data) {
	data = data || {};
	var c = X(`
		<div class="sfx_sticky_note sfx_sticky_note_${position}">
			<div class="sfx_sticky_note_close"></div>
			<div>${content}</div>
			<div class="sfx_sticky_note_arrow_border"></div>
			<div class="sfx_sticky_note_arrow"></div>
		</div>
	`);
	var $o = X(o);
	o = $o[0];
	var ps = $o.css('position');
	if (ps!="relative" && ps!="absolute" && ps!="fixed") {
		o.style.position="relative";
	}
	try {
		c.css('visibility', 'hidden').appendTo(o);
	} catch(e) { alert(e); }
	var height = c[0].offsetHeight;
	c[0].style.marginTop = -(height/2) + "px";
	c[0].style.visibility="visible";
	// Close functionality
	var close = c.find('.sfx_sticky_note_close');
	if (false!==data.close) {
		close.click(function() {
			c.remove();
		})
		if (typeof data.closefunc=="function") {
			data.closefunc();
		}
	}
	else {
		close.remove();
	}
	return c;
}

// Check to make sure that the extension's storage is working correctly
FX.on_options_load(function() {
    var now = X.now();
    var success = null;
    var error = function() {
        // Oops, storage didn't work!
        bubble_note("Social Fixer was not able to write to storage. This might be a problem with your browser profile or configuration. Please see the Support tab in Options for help with this issue. Until fixed, options and changes will reset each time you load the page.", {"close": true, "title": "Extension Storage Error", "style": "width:300px;"});
    };
    setTimeout(function() {
        if (success==null) {
            error();
        }
    },5000);
    X.storage.set('storage_check','storage_checked_on',now,function() {
        // Storage should have persisted by now
        // Try retrieving it
        X.storage.get('storage_check',null,function(stats) {
            if (!stats || now!=stats.storage_checked_on) {
                success = false;
                error();
            }
            success = true;
        },false);
    })
});

FX.add_option('stretch_wide',
    {
        "section": "User Interface",
        "title": 'Stretch Wide',
        "description": 'The option to stretch the screen to full width is no longer a part of Social Fixer, because it was difficult to maintain and caused undesireable side-effects. If you use Stylish, browse the available "wide" styles by clicking the button to the right.',
        "type":"link",
        "url":"https://userstyles.org/styles/browse?as=1&per_page=25&search_terms=facebook+wide"
    }
);
FX.add_option('tip_autoplay_videos',
    {
        "section": "Tips",
        "title": 'Disable Auto-Play Videos',
        "description": 'You can prevent videos from automatically playing in your news feed as you scroll past them by disabling the auto-play option in your settings.',
        "type":"link",
        "url":"/settings?tab=videos&sfx_highlight_autoplay=true"
    }
);
FX.on_content_loaded(function() {
    if (/tab=videos\&sfx_highlight_autoplay=true/.test(location.href)) {
        X('form[action*="autoplay"]').closest('li').css('outline','4px solid yellow');
    }
});

FX.add_option('tip_friends_privacy',
    {
        "section": "Tips",
        "title": 'Make Your Friends List Private',
        "description": 'Hackers often create fake accounts using your publicly-available name and profile picture. Then they send friend requests to all your friends, pretending to be you and saying that you had to create a new account. You can prevent this kind of attack by not making your Friends list visible to these hackers.\nChange your Friends List privacy to "Friends" (or Custom).',
        "type":"link",
        "url":"/me/friends?sfx_tip_friends_privacy=true"
    }
);
FX.on_content_loaded(function() {
    if (/friends\?sfx_tip_friends_privacy=true/.test(location.href)) {
        var manage = X("#pagelet_timeline_medley_friends button").first();
        manage.css('outline','3px solid yellow');
        setTimeout(function() {
            X.ui.click( manage );
            setTimeout(function() {
                var edit = X('a[href="/ajax/timeline/friends/edit_dialog.php"]');
                edit.css('outline','3px solid yellow');
                setTimeout(function() {
                    X.ui.click( edit );
                },500);
            },1000);
        },1000)
    }
});

FX.add_option('tip_hide_birthday',
    {
        "section": "Tips",
        "title": 'Hide Your Birthday',
        "description": 'If you aren\'t the kind of person who wants all your acquaintances writing on your wall on your birthday, you can hide your birthday so none of your friends get alerted that it\'s your birthday.',
        "type":"link",
        "url":"/me/about?section=contact-info&pnref=about&sfx_hide_birthday=true"
    }
);
FX.on_content_loaded(function() {
    if (/sfx_hide_birthday=true/.test(location.href)) {
        var selector = 'a[ajaxify^="/profile/edit/infotab/forms/?field_type=birthday"]';
        X.when(selector,function(item) {
            item = item.first();
            item.css('outline', '3px solid yellow');
            item[0].scrollIntoView();
            setTimeout(function () {
                X.ui.click(item);
                X.when('form[ajaxify="/profile/edit/infotab/save/birthday/"] a.uiSelectorButton', function(edit) {
                    edit = edit.first();
                    edit.css('outline', '3px solid yellow');
                    setTimeout(function () {
                        X.ui.click(edit);
                    },1000);
                });
            }, 1000);
        });
    }
});

FX.add_option('tip_live_video_notifications',
    {
        "section": "Tips",
        "title": 'Disable Live Video Notifications',
        "description": 'Disable the notifications that Facebook sends when friends or pages "go live" with video.',
        "type":"link",
        "url":"/settings?tab=notifications&section=on_facebook&view&highlight_live_video=true"
    }
);
FX.on_content_loaded(function() {
    if (/highlight_live_video=true/.test(location.href)) {
        X('form[ajaxify*="live_video"]').closest('li').css('outline','4px solid yellow');
    }
});

FX.add_option('tip_page_notifications',
    {
        "section": "Tips",
        "title": 'Get Notified When Pages Post',
        "description": 'Facebook has a built-in feature that sends you a Notification whenever a Page that you choose makes a post, so you never miss anything important. Click the button to be shown how to subscribe to Social Fixer Page notifications.',
        "type":"link",
        "url":"/socialfixer?sfx_notifications=true"
    }
);
FX.on_content_loaded(function() {
    if (/socialfixer\?sfx_notifications=true/.test(location.href)) {
        X.when(".likedButton",function() {
            var like = X(".likedButton").first();
            like.parent().css('outline', '3px solid yellow');
            setTimeout(function () {
                X.ui.click(like);
                setTimeout(function () {
                    var notif = X('a[ajaxify^="/pages/get_notification/?tab=notif"]').closest('li').next();
                    notif.css('outline', '3px solid yellow');
                }, 500);
            }, 1000);
        });
    }
});

FX.add_option('tip_timeline_posts',
    {
        "section": "Tips",
        "title": 'Restrict Posts To Your Timeline',
        "description": `If you want to prevent friends and others from writing on your timeline (which may show up in other friends' news feed), you can restrict permissions to Only Me so no one can write on your wall.`,
        "type":"link",
        "url":"https://www.facebook.com/settings?tab=timeline&sfx_write_timeline=true"
    }
);
FX.on_content_loaded(function() {
    if (/sfx_write_timeline=true/.test(location.href)) {
        var selector = 'a[href="/settings?tab=timeline&section=posting"]';
        X.when(selector,function(item) {
            item = item.parent();
            item.css('outline', '3px solid yellow');
        });
    }
});

// ===================================================
// Add a link to watch posts in SFX Watch util
// ===================================================
FX.add_option('sfx_watch',{"section":"Experiments","title":'Social Fixer Watch',"description":"Add an icon to each post (next to the timestamp) that adds the story to the Social Fixer Watch utility, letting you track new Likes, Comments, and Shares.","default":false});
FX.on_content(function(o) {
	if (FX.option('sfx_watch')) {
		o.find('abbr.timestamp,abbr[data-utime]')
			.parent('a:not(.sfx_watched):not(.uiLinkSubtle)')
			.addClass('sfx_watched')
			.after(`
				<a class="sfx_watch" href="#" title="Add to Social Fixer Watch" onclick="window.open('http://socialfixer.com/watch/?'+encodeURIComponent(this.parentNode.querySelector('.sfx_watched').getAttribute('href')),'SFX_WATCH');return false;"></a>
			`);
	}
});


// Init
// ====
// First add any CSS that has been built up
FX.css_dump();
// Queue or Fire the DOMContentLoaded functions
FX.fire_content_loaded();
// Load Options (async)
X.storage.get(['options','filters','tweaks','hiddens','postdata','friends','stats','tasks','messages'],[{},[],[],{},{},{},{},{},{}],function(options) {
	FX.options_loaded(options);
});

} catch(e) {
	console.log(e);
}