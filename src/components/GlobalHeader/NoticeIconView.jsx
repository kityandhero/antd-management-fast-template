import React, { Component } from 'react';
import { Tag, message } from 'antd';
import { connect } from 'umi';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';

class GlobalHeaderRight extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'notice/singleList',
      });
    }
  }

  changeReadState = (clickedItem) => {
    const { id } = clickedItem;
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'notice/changeNoticeReadState',
        payload: id,
      });
    }
  };

  handleNoticeClear = (title, key) => {
    const { dispatch } = this.props;

    message.success(`${'清空了'} ${title}`);

    if (dispatch) {
      dispatch({
        type: 'notice/clearNotices',
        payload: key,
      });
    }
  };

  getNoticeData = () => {
    const { notices = [] } = this.props;

    if (notices.length === 0) {
      return {};
    }

    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };

      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).utcOffset(8).fromNow();
      }

      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }

      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];

        newNotice.extra = (
          <Tag
            color={color}
            style={{
              marginRight: 0,
            }}
          >
            {newNotice.extra}
          </Tag>
        );
      }

      return newNotice;
    });

    return groupBy(newNotices, 'type');
  };

  getUnreadData = (noticeData) => {
    const unreadMsg = {};

    Object.keys(noticeData).forEach((key) => {
      const value = noticeData[key];

      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }

      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter((item) => !item.read).length;
      }
    });

    return unreadMsg;
  };

  render() {
    const { currentOperator, fetchingNotices, onNoticeVisibleChange } = this.props;
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);

    return (
      <NoticeIcon
        className={styles.action}
        count={0}
        onItemClick={(item) => {
          this.changeReadState(item);
        }}
        loading={fetchingNotices}
        clearText="清空"
        viewMoreText="查看更多"
        onClear={this.handleNoticeClear}
        onPopupVisibleChange={onNoticeVisibleChange}
        onViewMore={() => message.info('Click on view more')}
        clearClose
      >
        <NoticeIcon.Tab
          tabKey="notification"
          count={unreadMsg.notification}
          list={noticeData.notification}
          title="通知"
          emptyText="你已查看所有通知"
          showViewMore
        />

        <NoticeIcon.Tab
          tabKey="message"
          count={unreadMsg.message}
          list={noticeData.message}
          title="消息"
          emptyText="您已读完所有消息"
          showViewMore
        />

        <NoticeIcon.Tab
          tabKey="event"
          title="待办"
          emptyText="你已完成所有待办"
          count={unreadMsg.event}
          list={noticeData.event}
          showViewMore
        />
      </NoticeIcon>
    );
  }
}

export default connect(({ currentOperator, global, loading }) => ({
  currentOperator: currentOperator.currentOperator,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects['notice/singleList'],
  fetchingNotices: loading.effects['notice/singleList'],
  notices: global.notices,
}))(GlobalHeaderRight);
