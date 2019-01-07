import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import MapsSearchBar from './mapsSearchBar';

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  
});

class PrimarySearchAppBar extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
              <Link to="/" style={{ textDecoration: 'none', color: 'white' }} >
                  EVelozcity
              </Link>
            </Typography>
            <MapsSearchBar handleAddressInput={this.props.handleAddressInput}/>
            <div className={classes.grow} />
            <Button component={Link} to="/host" color="inherit">Become a Host</Button>
            {/* <Button component={Link} to="/account" color="inherit">My Account</Button> */}
            <Button component={Link} to="/charges" color="inherit">Charges</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

PrimarySearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PrimarySearchAppBar);
