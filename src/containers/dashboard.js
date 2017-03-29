'use strict';


import React from 'react';
import { connect } from 'react-redux';
import { setTitle, fetchGroups } from '../actions';
import GroupsList from '../components/groups-list';


class Dashboard extends React.Component {

  constructor(props) {

    super(props);
    this.goToGroup = this.goToGroup.bind(this);
  }

  componentWillMount() {

    this.props.setTitle('Dashboard');
    this.props.fetchGroups();
  }

  goToGroup(group) {

    this.props.router.push('/groups/' + encodeURIComponent(group._id));
  }
  render() {

    if (!this.props.hasLoaded) {
      return null;
    }

    return (
      <div>
        <h1>Grupos matriculados</h1>
        <GroupsList groups={this.props.groups} goToGroup={this.goToGroup} />
      </div>
    );
  }

}


const mapStateToProps = (state, ownProps) => ({
  userCtx: state.session.userCtx,
  hasLoaded: state.groups.hasLoaded,
  groups: state.groups.groups
});


const mapDispatchToProps = {
  setTitle,
  fetchGroups
};


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
