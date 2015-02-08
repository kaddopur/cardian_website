'use strict';
var React = require('react/addons');
var NavLink = require('flux-router-component').NavLink;
var cx = React.addons.classSet;

var NavMenu = React.createClass({
    getDefaultProps: function () {
        return {
            selected: 'home',
            links: {},
            ui: {
                openNavMenu: false
            }
        };
    },
    render: function() {
        var selected = this.props.selected;
        var links = this.props.links;

        var linkHTML = Object.keys(links).map(function (name) {
            var link = links[name];
            var linkClass = cx({
                'menu-item-divided pure-menu-selected': (selected === name)
            });

            return (
                <li className={linkClass} key={link.path}>
                    <NavLink routeName={link.page}>{link.title}</NavLink>
                </li>
            );
        });

        var menuClass = cx({
            'active': this.props.ui.openNavMenu
        });

        return (
            <div id="menu" className={menuClass}>
                <div className="pure-menu pure-menu-open">
                    <a className="pure-menu-heading" href="#">Cardian</a>
                    <ul>{linkHTML}</ul>
                </div>
            </div>
        );
    }
});

module.exports = NavMenu;