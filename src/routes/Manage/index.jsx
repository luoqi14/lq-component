/* eslint-disable import/no-dynamic-require,no-unused-vars */
import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import asyncComponent from '../../components/AsyncComponent';
import PrivateRoute from '../../components/PrivateRoute';

const SearchList = asyncComponent(() => import(
  /* webpackChunkName: "SearchList" */
  './SearchList'));

const BasicDetail = asyncComponent(() => import(
  /* webpackChunkName: "BasicDetail" */
  './BasicDetail'));

const Routes = () => (
  <Switch>
    <PrivateRoute exact path="/Manage/SearchList" component={SearchList} />
    <PrivateRoute exact path="/Manage/BasicDetail" component={BasicDetail} />
    <Redirect exact from="/Manage" to="/Manage/SearchList" />
    <Redirect to="/404" />
  </Switch>
);

export default Routes;

