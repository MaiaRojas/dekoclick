import React from 'react';
import { Card, CardTitle, CardText, CardActions, CardMenu, Button, IconButton } from 'react-mdl';


class GroupCard extends React.Component {

  render() {

    const goToGroup = this.props.goToGroup.bind(null, this.props.group);

    return (
      <Card>
        <CardTitle>{this.props.group._id}</CardTitle>
        <CardText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Mauris sagittis pellentesque lacus eleifend lacinia...
        </CardText>
        <CardActions border>
          <Button raised colored onClick={goToGroup}>Ver grupo</Button>
        </CardActions>
      </Card>
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
