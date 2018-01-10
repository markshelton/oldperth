const dotenv = require('dotenv')
dotenv.load({path: "../config/.env"})
dotenv.load({path: "../config/.secrets"})

import {initialize_map, fillPopularImagesPanel} from './viewer';
import './app-history';
import './search';

$(function() {
  fillPopularImagesPanel();
  initialize_map();
});
