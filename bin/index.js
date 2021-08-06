#!/usr/bin/env node

require('../commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const { Search } = require('../search');

const params = process.argv.splice(2)[0];

new Search({ params });
