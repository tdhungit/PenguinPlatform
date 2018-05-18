import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import _ from 'underscore';
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Alert,
    Button
} from 'reactstrap';

import {t, T} from '/imports/common/Translation';
import container from '../../../../../common/Container';
import Notifications from '../../../../../collections/Notifications/Notifications';
import {NotificationUtils} from './utils';
import {utilsHelper} from '../../../helpers/utils/utils';
import {NotificationTypes} from '../../../../../collections/Notifications/config';

class ChatInviteModalContainer extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {

    }

    toggle() {
        this.setState({isOpen: false});
    }

    joinChat(channel) {
        const pos = _.findIndex(channel.users, {_id: Meteor.userId()});
        channel.users[pos].status = 'Active';
        Meteor.call('chatChannels.update', channel, (error) => {
            utilsHelper.alertSystem(error);
        });
    }

    cancelChat(channel) {
        const pos = _.findIndex(channel.users, {_id: Meteor.userId()});
        channel.users[pos].status = 'Inactive';
        Meteor.call('chatChannels.update', channel, (error) => {
            utilsHelper.alertSystem(error);
        });
    }

    render() {
        const {notify, isOpen} = this.props;

        if (!notify || !notify.params || !notify.params.channel || !notify.params.channel._id) {
            return <div/>;
        }

        NotificationUtils.read(notify._id);
        const channel = notify.params.channel;
        return (
            <Modal isOpen={isOpen}>
                <ModalHeader toggle={this.toggle}>
                    <i className="fa fa-send"/> <T>Chat Invited</T>
                </ModalHeader>
                <ModalBody>
                    <Alert color="primary">
                        <T>You were invited to</T> {channel.name}. <T>Do you want to join it?</T>
                    </Alert>
                </ModalBody>
                <ModalFooter>
                    <Button type="button"
                            color="primary"
                            onClick={() => this.joinChat(channel)}>
                        <T>Ok</T>
                    </Button>{' '}
                    <Button type="button"
                            color="secondary"
                            onClick={() => this.cancelChat(channel)}>
                        <T>Cancel</T>
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}
export const ChatInviteModal = container((props, onData) => {
    const notify = Notifications.findOne({
        type: NotificationTypes.ChatInvite
    });
    let isOpen = false;
    if (notify && notify.params.channel && notify.params.channel._id) {
        isOpen = true;
    }

    onData(null, {
        notify: notify,
        isOpen: isOpen
    });
}, ChatInviteModalContainer);