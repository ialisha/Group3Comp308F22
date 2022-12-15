import { Route, Switch } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import DailyINFOrm from "./pages/DailyINFOrm";
import SignIn from "./pages/SignIn";
import SendTip from "./pages/SendTip";
import DailyTips from "./pages/DailyTips";
import PatientAlerts from "./pages/PatientEmergencyAlerts";
import SendEmergencyAlert from "./pages/sendEmergencyAlert";
import RecordVitals from "./pages/RecordVitals";
import SearchRecords from "./pages/SearchRecords";
import Advisor from "./pages/Advisor";
import NotFound from "./pages/NotFound";
import Fitness from "./pages/Fitness";
export default function App() {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main className="container mt-5 py-5">
        <Switch>
          <Route path="/daily-tip">
            <DailyTips />
          </Route>
          <Route path="/send-tip">
            <SendTip />
          </Route>
          <Route path="/sign-in">
            <SignIn />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/account">
            <Profile />
          </Route>
          <Route path="/DailyINFOrm">
            <DailyINFOrm />
          </Route>
          <Route path="/fitness">
            <Fitness />
          </Route>
          <Route path="/record-vitals">
            <RecordVitals />
          </Route>
          <Route path="/past-records">
            <SearchRecords />
          </Route>
          <Route path="/advisor">
            <Advisor />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/PatientEmergencyAlerts">
            <PatientAlerts />
          </Route>
          <Route path="/sendEmergencyAlert">
            <SendEmergencyAlert />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </main>
      <footer></footer>
    </>
  );
}
