#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CloudProjectStack } from '../lib/cloud_project-stack';

const app = new cdk.App();
new CloudProjectStack(app, 'CloudProjectStack', {
});