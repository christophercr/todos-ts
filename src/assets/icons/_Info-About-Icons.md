# Angular Material Design Icon Sets #

*As icon sets are not included to AngularMaterial by default, they can be found here: [https://github.com/nkoterba/material-design-iconsets](https://github.com/nkoterba/material-design-iconsets)*

These sets correspond to [https://design.google.com/icons/](https://design.google.com/icons/).

Check out complete set/list with preview here: https://materialdesignicons.com/

See updated Building instructions below since this file is **not** built by default (but is included by default in the 'iconsets' folder).

For a quick way to see which icons are available and which set they belong to, use [klarsys' demo](https://klarsys.github.io/angular-material-icons/) as a reference.

In particular, they are in the required format to use with Angular Material Design's
[$mdIconProvider]
(https://material.angularjs.org/#/api/material.components.icon/service/$mdIconProvider).

## Usage ##
```javascript
angular.module("myApp", [])
.config(["$mdIconProvider", function($mdIconProvider) {
      $mdIconProvider
        .iconSet("action", "../styles/images/icons/material-design/action-icons.svg", 24)
        .iconSet("alert", "../styles/images/icons/material-design/alert-icons.svg", 24)
        .iconSet("av", "../styles/images/icons/material-design/av-icons.svg", 24)
        .iconSet("communication", "../styles/images/icons/material-design/communication-icons.svg", 24)
        .iconSet("content", "../styles/images/icons/material-design/content-icons.svg", 24)
        .iconSet("device", "../styles/images/icons/material-design/device-icons.svg", 24)
        .iconSet("editor", "../styles/images/icons/material-design/editor-icons.svg", 24)
        .iconSet("file", "../styles/images/icons/material-design/file-icons.svg", 24)
        .iconSet("hardware", "../styles/images/icons/material-design/hardware-icons.svg", 24)
        .iconSet("icons", "../styles/images/icons/material-design/icons-icons.svg", 24)
        .iconSet("image", "../styles/images/icons/material-design/image-icons.svg", 24)
        .iconSet("maps", "../styles/images/icons/material-design/maps-icons.svg", 24)
        .iconSet("navigation", "../styles/images/icons/material-design/navigation-icons.svg", 24)
        .iconSet("notification", "../styles/images/icons/material-design/notification-icons.svg", 24)
        .iconSet("social", "../styles/images/icons/material-design/social-icons.svg", 24)
        .iconSet("toggle", "../styles/images/icons/material-design/toggle-icons.svg", 24)
    }])
```

Now you can use them in your html quite easily:
```html
  <md-button ng-click="vm.showNewDialog($event)">
    <md-icon md-svg-icon="editor:attach_file" style="color: yellow; width: 10px; height:10px"></md-icon>
    <span>New</span>
  </md-button>
```

Although added width and height CSS properties, the svg graphic remains at 24px 24px.
Instead the md-icon element is resized correctly and the svg image is clipped.




