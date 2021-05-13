import React, { Suspense, lazy } from "react"
import { Router, Switch, Route } from "react-router-dom"
import { history } from "./history"
import { connect } from "react-redux"
import Spinner from "./components/@vuexy/spinner/Loading-spinner"
import { ContextLayout } from "./utility/context/Layout"
import knowledgeBaseCategory from "./views/pages/knowledge-base/Category"
import knowledgeBaseQuestion from "./views/pages/knowledge-base/Questions"

// Route-based code splitting
const portfolios = lazy(() => import("./views/ui-elements/data-list/ListView"))
const Dashboard = lazy(() => import("./views/tables/aggrid/Aggrid1"))
const Strategies = lazy(() => import("./views/ui-elements/data-list/Strategies"))
const Crypto = lazy(() => import("./views/ui-elements/data-list/Crypto"))
const Blogs = lazy(() => import("./views/tables/aggrid/Blogs"))
const articleview = lazy(() => import("./views/charts/apex/ApexCharts"))
const userEdit = lazy(() => import("./views/apps/user/edit/Edit"))
const userView = lazy(() => import("./views/apps/user/view/View"))
const login = lazy(() => import("./views/pages/authentication/login/Login"))
const LandingPage = lazy(() => import("./views/pages/misc/Maintenance"))
const register = lazy(() => import("./views/pages/authentication/register/Register"))
const knowledgeBase = lazy(() =>
  import("./views/pages/knowledge-base/KnowledgeBase")
)

const page_404 = lazy(() => import("./views/pages/misc/error/404"))

// Set Layout and Component Using App Route
const RouteConfig = ({ component: Component, fullLayout, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      return (
        <ContextLayout.Consumer>
          {context => {
            let LayoutTag =
              fullLayout === true
                ? context.fullLayout
                : context.state.activeLayout === "horizontal"
                ? context.horizontalLayout
                : context.VerticalLayout
            return (
                <LayoutTag {...props} permission={props.user}>
                    <Suspense fallback={<Spinner />}>
                        <Component {...props} />
                    </Suspense>
              </LayoutTag>
            )
          }}
        </ContextLayout.Consumer>
      )
    }}
  />
)

const mapStateToProps = state => {
  return {
    token: state.auth.token
  }
}

const AppRoute = connect(mapStateToProps)(RouteConfig)

class AppRouter extends React.Component {
  render() {
    return (
      // Set the directory path if you are deploying in sub-folder
      <Router history={history}>
        <Switch>
            <Route exact path="/" component={LandingPage}/>
            <AppRoute path="/dashboard" component={Dashboard} />
            <AppRoute path="/strategies" component={Strategies} />
            <AppRoute path="/crypto" component={Crypto} />
            <AppRoute path="/blogs" component={Blogs} />
            <AppRoute path="/articleview/:articleID" component={articleview} />
            <AppRoute path="/portfolios" component={portfolios} />
            <AppRoute path="/login" component={login} fullLayout />
            <AppRoute path="/register" component={register} fullLayout />
            <AppRoute path="/user/edit" component={userEdit} />
            <AppRoute path="/user/view" component={userView} />
            <AppRoute path="/knowledgebase" component={knowledgeBase} exact/>
            <AppRoute path="/pages/knowledge-base/category/:categoryId" component={knowledgeBaseCategory} exact />
            <AppRoute path="/pages/knowledge-base/category/questions/:categoryId/:questionId" component={knowledgeBaseQuestion}/>
            <Route component={page_404} />
        </Switch>
      </Router>
    )
  }
}

export default AppRouter
