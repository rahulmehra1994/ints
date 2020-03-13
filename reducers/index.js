import { combineReducers } from 'redux'
import * as reducers from './reactReducers'
// import * as AspireFeedback from './AspireFeedback'
// import * as AspireCommunityCustomisation from './AspireCommunityCustomisation'
// import * as AspireSamples from './AspireSamples'
// import * as AspireEditDynamicData from './AspireEditDynamicData'
// import * as AspireResumeGap from './AspireResumeGap'
// import * as DetailedFeedback from './DetailedFeedback'
// import * as Login from './Login'
// import * as Edit from './Edit'
// import * as CustomerFeedback from './CustomerFeedback'
// import * as ImageUpload from './ImageUpload'
// import * as Tour from '../tour/Reducer'
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

// $.extend(reducers, AspireCommunityCustomisation)
// $.extend(reducers, AspireFeedback)
// $.extend(reducers, AspireSamples)
// $.extend(reducers, AspireEditDynamicData)
// $.extend(reducers, AspireResumeGap)
// $.extend(reducers, DetailedFeedback)
// $.extend(reducers, Login)
// $.extend(reducers, Edit)
// $.extend(reducers, ImageUpload)
// $.extend(reducers, Tour)
// $.extend(reducers, CustomerFeedback)
$.extend(reducers, combinedEP)

export default combineReducers(reducers)
