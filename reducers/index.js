import { combineReducers } from 'redux'
import * as reducers from './reactReducers'
import * as AccountStates from '@vmockinc/dashboard/Account/states'
import * as DashboardStates from '@vmockinc/dashboard/Dashboard/states'
import * as NavbarReducers from '@vmockinc/dashboard/Navbar/reducers'
import * as userCustomizations from '@vmockinc/dashboard/Dashboard/reducers/UserCustomizations'
import * as JobsReducers from '@vmockinc/dashboard/Jobs/reducers'
import $ from 'jquery'
import combinedEP from './../EP/reducers/mainReducer'
//nf related below
import * as requestFeedback from '@vmockinc/dashboard/NetworkFeedback/reducers/RequestFeedback'
import * as homePage from '@vmockinc/dashboard/NetworkFeedback/reducers/HomePage'
import * as networkContacts from '@vmockinc/dashboard/NetworkFeedback/reducers/NetworkContacts'
import * as ResumeReducers from '@vmockinc/dashboard/Resume/reducers'
//nf related end
$.extend(reducers, userCustomizations)
$.extend(reducers, AccountStates)
$.extend(reducers, DashboardStates)
$.extend(reducers, NavbarReducers)
$.extend(reducers, JobsReducers)

$.extend(reducers, combinedEP)
//nf related below
$.extend(reducers, requestFeedback)
$.extend(reducers, homePage)
$.extend(reducers, networkContacts)
$.extend(reducers, ResumeReducers)
//nf related end

export default combineReducers(reducers)
