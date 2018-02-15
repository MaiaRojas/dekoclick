import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import red from 'material-ui/colors/red';
import FavoriteIcon from 'material-ui-icons/Favorite';
import ShareIcon from 'material-ui-icons/Share';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import isUrl from '../util/isUrl'
import Github  from '@octokit/rest'
let octokit = Github();


/**
 * Author: Johnny Broadway <johnny@johnnybroadway.com>
 * Website: https://gist.github.com/jbroadway/2836900
 * License: MIT
 */
function ParseMarkDown() {
  // Rules
  this.rules =  [
    {
      regex: /(#+)(.*)/g,
      replacement:  (text, chars, content)  => {
        var level = chars.length;
        if (level == 1) {
          this.project.name = content;
        }
        return '<h' + level + '>' + content.trim() + '</h' + level + '>';
      }
    },                                         // headers
    {regex: /!\[([^\[]+)\]\(([^\)]+)\)/g,
      replacement:  (text, chars, content)  => {
        var level = chars.length;
        this.project.image = content;
        return `<img src=\'${content}\' alt=\'${chars}\'>`;
      }
    }, // image  replacement: '<img src=\'$2\' alt=\'$1\'>'}
    {regex: /\[([^\[]+)\]\(([^\)]+)\)/g,

      replacement:  (text, chars, content)  => {
        var level = chars.length;
        this.project.where = chars;
        return `<a href=\'${content}\'>${chars}</a>`;
      }// hyperlink
    }

  ];
  this.project = {
    name: '',
    image: '',
    where: ''
  };

  // Add a rule.
  this.addRule = function (regex, replacement) {
    regex.global = true;
    regex.multiline = false;
    this.rules.push({regex: regex, replacement: replacement});
  };

  // Render some Markdown into HTML.
  this.render = function (text) {
    text = '\n' + text + '\n';
    this.rules.forEach(function (rule) {
      text = text.replace(rule.regex, rule.replacement);
    });
    return text.trim();
  };
}

const styles = theme => ({
  card: {

  },
  media: {
    height: 154,
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class GithubCard extends React.Component {
  state = {
      id : '',
      name: '',
      where: '',
      description: '',
      tags: '',
      image: '',
      github: '',
      demo: '',
      error : false
  }

  createGithubProjectInfo =  (str) => {
      var searchText = "github.com/";
      var pos = str.search(searchText);
      if (pos < 0) {
        return;
      }
      var res = str.substring(pos + searchText.length);
      var splitPos = res.search("/");
      if (splitPos < 0) {
          return;
      }
      var owner = res.substring(0, splitPos);
      var repo = res.substring(splitPos + 1);
      var projectId = this.props.pos;

      this.props.firebase.firestore().doc(`/users/${this.props.uid}/`).get().then ( res => {

        if (false && res.data()) {
          console.log ('data>>', res.data().githubProjects)
          let repoObj = res.data().githubProjects[projectId];
          let repoErrors = {}
          repoErrors.demo =  !isUrl (repoObj.demo);
          repoErrors.description =  repoObj.description && repoObj.description.length < 140;
          repoErrors.tags =  repoObj.tags && repoObj.tags.length === 0;
          repoErrors.name =  repoObj.name && repoObj.name.length === 0;
          repoErrors.image =  repoObj.image && repoObj.image.length === 0   ||  !isUrl (repoObj.demo);;
          repoErrors.where =  repoObj.where && repoObj.where.length === 0;
          const composedObject = Object.assign ({...this.state}, repoObj, {repoErrors: repoErrors});
          this.setState(composedObject);

        } else {
            octokit.repos.get({owner, repo}).then(res => {
            var date = new Date(res.data.updated_at)
            octokit.repos.getReadme({owner, repo}).then(result => {
              var decodedString = atob(result.data.content);
              var regex = new ParseMarkDown ();
              regex.render (decodedString);
              octokit.repos.getTopics({
                  owner,
                  repo
              }).then( (resTags) =>  {
                  const repoObj = {
                    id : projectId,
                    demo: res.data.homepage,
                    github: res.data.html_url,
                    license: res.data.license,
                    description: res.data.description,
                    date: date.getFullYear(),
                    name: res.data.name,
                    tags: resTags.data.names.join(', '),
                    ...regex.project
                  }
                  let repoErrors = {}
                  repoErrors.demo =  !isUrl (repoObj.demo);
                  repoErrors.description =  repoObj.description && repoObj.description.length < 140;
                  repoErrors.tags =  repoObj.tags && repoObj.tags.length === 0;
                  repoErrors.name =  repoObj.name && repoObj.name.length === 0;
                  repoErrors.image =  repoObj.image && repoObj.image.length === 0   ||  !isUrl (repoObj.demo);;
                  repoErrors.where =  repoObj.where && repoObj.where.length === 0;

                  const composedObject = Object.assign ({...this.state}, repoObj, {repoErrors: repoErrors});
                  this.setState(composedObject);

                  this.props.firebase.firestore().collection('users').doc(this.props.uid).update( {[`githubProjects.${projectId}`]: repoObj} );
              });
            })
          })
        }
      }).catch ( err => {
          console.log (err);
      });
   }
  componentWillMount () {

      octokit.authenticate({
         type: 'oauth',
         token: 'be3acaa7c3b7c44093ae6a862b0bbb1da733f96b'
     })
     this.createGithubProjectInfo(this.props.url)

  }

  render() {
      const { classes } = this.props;
      const project = this.state;
      const error = this.state.repoErrors;
      if (!project) {
        return <div > error con repo {this.props.url} </div>
      }
      if (!error) {
        return <div > error-error con repo {this.props.url} </div>
      }
      return (
          <Card className={classes.card}  >
           <CardHeader
             avatar={
               <Avatar aria-label="Recipe" className={classes.avatar}>
                 A
               </Avatar>
             }
             action={
               <IconButton>
                 <MoreVertIcon />
               </IconButton>
             }
             title={project.name}
             subheader={error.where ? 'El Lugar donde realizastes este  proyecto no existe o presenta un error' :  project.where + ' - ' + project.date}
           />
           <CardMedia
             className={classes.media}
             image={project.image}
             title= {error.image ? 'La imagen  de este repositorio no existe o presenta un  error' : project.name}
           />
           <CardContent>
             <Typography component="p">
                {error.description ? 'La descripción de este repositorio no existe o presenta un  error' : project.description}
             </Typography>
              <div>
                <strong>Tecnologia utilizada: </strong>
                {project.tags}
                <br/>
                <a href={project.github} target="_blank" > Repositorio en Github</a>
                <br/>
                <a href={project.demo} target="_blank" > {error.demo ? 'Demo website no existe o  presenta un error' : 'Website' } </a>
              </div>
          </CardContent>
           {/*}
           <CardActions className={classes.actions} disableActionSpacing>
             <IconButton aria-label="Add to favorites">
               <FavoriteIcon />
             </IconButton>
             <IconButton aria-label="Share">
               <ShareIcon />
             </IconButton>

           </CardActions>
           */}
         </Card>
    );
  }
}

GithubCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GithubCard);
