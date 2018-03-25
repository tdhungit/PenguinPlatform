import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {
    Badge,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Nav,
    NavItem,
    NavLink,
    NavbarToggler,
    NavbarBrand,
    DropdownToggle
} from 'reactstrap';
import {Link} from 'react-router-dom';

import {ImageTag} from '../../helpers/tags/MediaImage';

class Header extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    sidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-hidden');
    }

    sidebarMinimize(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-minimized');
    }

    mobileSidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-mobile-show');
    }

    asideToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('aside-menu-hidden');
    }

    handleLogout() {
        Meteor.logout(() => {
            this.props.history.push('/login');
        });
    }

    render() {
        const currentUser = Meteor.user();
        return (
            <header className="app-header navbar">
                <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>&#9776;</NavbarToggler>
                <NavbarBrand href="#"></NavbarBrand>
                <NavbarToggler className="d-md-down-none" onClick={this.sidebarToggle}>&#9776;</NavbarToggler>
                <Nav className="d-md-down-none" navbar>
                    <NavItem className="px-3">
                        <Link to="/manager" className="nav-link">Dashboard</Link>
                    </NavItem>
                    <NavItem className="px-3">
                        <Link to="/manager/users" className="nav-link">Users</Link>
                    </NavItem>
                    <NavItem className="px-3">
                        <Link to="/manager/settings" className="nav-link">Settings</Link>
                    </NavItem>
                </Nav>
                <Nav className="ml-auto" navbar>
                    <NavItem className="d-md-down-none">
                        <NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
                    </NavItem>
                    <NavItem className="d-md-down-none">
                        <Link to="/manager/activities/calendar" className="nav-link">
                            <i className="icon-list"></i>
                        </Link>
                    </NavItem>
                    <NavItem className="d-md-down-none">
                        <NavLink href="#"><i className="icon-location-pin"></i></NavLink>
                    </NavItem>
                    <NavItem>
                        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle className="nav-link dropdown-toggle">
                                <ImageTag
                                    media={currentUser.profile && currentUser.profile.avatar ? currentUser.profile.avatar : ''}
                                    className="img-avatar" alt={currentUser && currentUser.emails[0].address}/>
                                <span className="d-md-down-none">{currentUser && currentUser.username}</span>
                            </DropdownToggle>
                            <DropdownMenu right className={this.state.dropdownOpen ? 'show' : ''}>
                                <DropdownItem header tag="div"
                                              className="text-center"><strong>Account</strong></DropdownItem>
                                <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge
                                    color="info">42</Badge></DropdownItem>
                                <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge
                                    color="success">42</Badge></DropdownItem>
                                <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge
                                    color="danger">42</Badge></DropdownItem>
                                <DropdownItem><i className="fa fa-comments"></i> Comments<Badge
                                    color="warning">42</Badge></DropdownItem>
                                <DropdownItem header tag="div"
                                              className="text-center"><strong>Settings</strong></DropdownItem>
                                <DropdownItem onClick={() => this.props.history.push('/manager/me')}><i
                                    className="fa fa-user"></i> Profile</DropdownItem>
                                <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
                                {/*<DropdownItem divider/>*/}
                                <DropdownItem onClick={this.handleLogout.bind(this)}><i
                                    className="fa fa-lock"></i> Logout</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </NavItem>
                </Nav>
                <NavbarToggler className="d-md-down-none" type="button"
                               onClick={this.asideToggle}>&#9776;</NavbarToggler>
            </header>
        )
    }
}

export default Header;
