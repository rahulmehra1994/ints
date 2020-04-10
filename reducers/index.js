import { combineReducers } from 'redux'
import * as reducers from './reactReducers'
import * as AccountStates from '@vmockinc/dashboard/Account/states'
import * as DashboardStates from '@vmockinc/dashboard/Dashboard/states'
import * as NavbarReducers from '@vmockinc/dashboard/Navbar/reducers'
import * as userCustomizations from '@vmockinc/dashboard/Dashboard/reducers/UserCustomizations'
import * as JobsReducers from '@vmockinc/dashboard/Jobs/reducers'
import $ from 'jquery'
import combinedEP from './../EP/reducers/mainReducer'

$.extend(reducers, userCustomizations)
$.extend(reducers, AccountStates)
$.extend(reducers, DashboardStates)
$.extend(reducers, NavbarReducers)
$.extend(reducers, JobsReducers)

$.extend(reducers, combinedEP)

export default combineReducers(reducers)
