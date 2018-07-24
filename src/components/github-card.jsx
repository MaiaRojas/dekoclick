import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardHeader, CardMedia, CardContent } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import red from 'material-ui/colors/red';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Github from '@octokit/rest';
import isUrl from '../util/isUrl';

const octokit = Github();

function ParseMarkDown() {
  this.firstImage = false;
  this.firstUrl = false;
  this.firstName = false;
  // Rules
  this.rules = [
    // headers
    {
      regex: /(#+)(.*)/g,
      replacement: (text, chars, content) => {
        const level = chars.length;
        if (level === 1) {
          if (!this.firstName) {
            this.firstName = true;
            this.project.name = content;
          }
          this.project.name = content;
        }

        return `<h${level}>${content.trim()}</h${level}>`;
      },
    },
    // image replacement
    {
      regex: /!\[([^[]+)\]\(([^)]+)\)/g,
      replacement: (text, chars, content) => {
        if (!this.firstImage) {
          this.firstImage = true;
          this.project.image = content;
        }
        return `<img src="${content}" alt="${chars}">`;
      },
    },
    // hyperlink
    {
      regex: /\[([^[]+)\]\(([^)]+)\)/g,
      replacement: (text, chars, content) => {
        if (!this.firstUrl) {
          this.project.where = chars;
          this.project.url = content;
          this.firstUrl = true;
        }
        return `<a href="${content}">${chars}</a>`;
      },
    },
  ];

  this.project = {
    name: '',
    image: '',
    where: '',
    url: '',
  };

  // Add a rule.
  this.addRule = (regex, replacement) => {
    Object.assign(regex, { global: true, multiline: false });
    this.rules.push({ regex, replacement });
  };

  // Render some Markdown into HTML.
  this.render = (text) => {
    let newtext = `\n${text}\n`;
    this.rules.forEach((rule) => {
      newtext = newtext.replace(rule.regex, rule.replacement);
    });
    return newtext.trim();
  };
}

const styles = theme => ({
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
  subheader: {
    color: theme.palette.text.primary,
  },
});


class GithubCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      name: '',
      where: '',
      description: '',
      tags: '',
      image: '',
      github: '',
      demo: '',
      error: false,
    };

    this.createGithubProjectInfo = (str) => {
      const searchText = 'github.com/';
      const pos = str.search(searchText);
      if (pos < 0) {
        return;
      }
      const substr = str.substring(pos + searchText.length);
      const splitPos = substr.search('/');
      if (splitPos < 0) {
        return;
      }
      const owner = substr.substring(0, splitPos);
      const repo = substr.substring(splitPos + 1);
      const projectId = this.props.pos;

      this.props.firebase.firestore().doc(`/users/${this.props.uid}/`).get()
        .then(() => {
          octokit.repos.get({ owner, repo }).then((res) => {
            const date = new Date(res.data.updated_at);
            octokit.repos.getReadme({ owner, repo }).then((result) => {
              const decodedString = atob(result.data.content);
              const regex = new ParseMarkDown();
              regex.render(decodedString);
              octokit.repos.getTopics({
                owner,
                repo,
              }).then((resTags) => {
                const repoObj = {
                  id: projectId,
                  demo: res.data.homepage,
                  github: res.data.html_url,
                  license: res.data.license,
                  description: res.data.description,
                  date: date.getFullYear(),
                  name: res.data.name,
                  tags: resTags.data.names.join(', '),
                  ...regex.project,
                };

                const repoErrors = {};
                repoErrors.demo = !isUrl(repoObj.demo);
                repoErrors.description = repoObj.description && repoObj.description.length > 280;
                repoErrors.tags = repoObj.tags.length === 0;
                repoErrors.name = repoObj.name && repoObj.name.length === 0;
                repoErrors.image = (repoObj.image && repoObj.image.length === 0)
                  || !isUrl(repoObj.demo);
                repoErrors.where = repoObj.where.length === 0;

                const composedObject = Object.assign({ ...this.state }, repoObj, { repoErrors });
                this.setState(composedObject);
                this.props.firebase.firestore().collection('users').doc(this.props.uid)
                  .update({ [`githubProjects.${projectId}`]: repoObj });
              });
            });
          });
        })
        .catch(err => console.log(err));
    };
  }

  componentWillMount() {
    octokit.authenticate({
      type: 'oauth',
      token: 'be3acaa7c3b7c44093ae6a862b0bbb1da733f96b',
    });
    this.createGithubProjectInfo(this.props.url);
  }

  render() {
    const { classes } = this.props;
    const project = this.state;
    const error = this.state.repoErrors;

    if (!project) {
      return <div>error con repo {this.props.url}</div>;
    }

    if (!error) {
      return <div>error-error con repo {this.props.url}</div>;
    }

    return (
      <Card className={classes.card}>
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
          classes={{ subheader: classes.subheader }}
          title={project.name}
          subheader={
            (error.where || error.where === null)
              ? 'El Lugar donde realizastes este proyecto no existe o presenta un error'
              : `${project.where}-${project.date}`
          }
        />
        <CardMedia
          className={classes.media}
          image={project.image}
          title={
            error.image
              ? 'La imagen  de este repositorio no existe o presenta un error'
              : project.name
          }
        />
        <CardContent>
          <Typography component="p">
            {(error.description || error.description === null)
              ? 'La descripción de este repositorio no existe o presenta un error'
              : project.description
            }
          </Typography>
          <div>
            <strong>Tecnología utilizada: </strong>
            {error.tags
              ? 'Los tags de este repositorio no existe o presenta un error'
              : project.tags
            }
            <br />
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              Repositorio en Github
            </a>
            <br />
            <a href={project.demo} target="_blank" rel="noopener noreferrer">
              {error.demo ? 'Demo website no existe o presenta un error' : 'Website'}
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }
}


GithubCard.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  url: PropTypes.string.isRequired,
  firebase: PropTypes.shape({
    firestore: PropTypes.func.isRequired,
  }).isRequired,
  pos: PropTypes.number.isRequired,
  uid: PropTypes.string.isRequired,
};


export default withStyles(styles)(GithubCard);