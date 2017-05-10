'use strict';


import React from 'react';


class GroupCard extends React.Component {

  render() {

    const goToGroup = this.props.goToGroup.bind(null, this.props.group);

    return (
      <div className="card">
        <div className="card-title">{this.props.group._id}</div>
        <div className="card-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Mauris sagittis pellentesque lacus eleifend lacinia...
        </div>
        <div className="card-actions">
          <button onClick={goToGroup}>Ver grupo</button>
        </div>
      </div>
    );
  }
}


export default class GroupsList extends React.Component {

  render() {

    return (
      <div>
        {this.props.groups.map(group =>
          <GroupCard key={group._id} group={group} goToGroup={this.props.goToGroup} />
        )}
      </div>
    );
  }
}
