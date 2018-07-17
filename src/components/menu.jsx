
// import React from 'react';
// import IconButton from 'material-ui/IconButton';
// import MenuIcon from 'material-ui-icons/Menu';
// import Menu from 'material-ui/Menu';
// import MenuItem from 'material-ui/MenuItem';

// class SimpleMenu extends React.Component {
//   state = {
//     anchorEl: null,
//   };

//   handleClick = event => {
//     this.setState({ anchorEl: event.currentTarget });
//   };

//   handleClose = () => {
//     this.setState({ anchorEl: null });
//   };

//   render() {
//     const { anchorEl } = this.state;

//     return (
//       <div>
//         {/* <Button
//           aria-owns={anchorEl ? 'simple-menu' : null}
//           aria-haspopup="true"
//           onClick={this.handleClick}
//         >
//           Open Menu
//         </Button> */}
//         <IconButton
//           aria-owns={anchorEl ? 'simple-menu' : null}
//           aria-haspopup="true"
//           onClick={this.handleClick}
//         >
//           <MenuIcon />
//         </IconButton>
//         <Menu
//           id="simple-menu"
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={this.handleClose}
//         >
//           <MenuItem onClick={this.handleClose}>Proyectos</MenuItem>
//           <MenuItem onClick={this.handleClose}>Diseñadores</MenuItem>
//           <MenuItem onClick={this.handleClose}>Cerrar Sesión</MenuItem>
//         </Menu>
//       </div>
//     );
//   }
// }

// export default SimpleMenu;