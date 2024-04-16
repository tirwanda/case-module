import ProfileOverview from "layouts/pages/profile/profile-overview";
import Settings from "layouts/pages/account/settings";
import SignInBasic from "layouts/authentication/sign-in/basic";
import CreateIncident from "layouts/incident/create-incident";

// Case Module Security components
import MDAvatar from "components/MDAvatar";

// @mui icons
import Icon from "@mui/material/Icon";

// Images
import profilePicture from "assets/images/shield.png";
import Incidents from "layouts/incident/incidents";
import Employes from "layouts/dashboards/employes";
import SecurityPICArea from "layouts/dashboards/securityPICArea";
import Analytics from "layouts/dashboards/analytics";

const routes = [
  {
    type: "collapse",
    name: "Security Case Module",
    key: "case-module",
    icon: <MDAvatar src={profilePicture} alt="case-module" size="sm" />,
    collapse: [
      {
        name: "My Profile",
        key: "my-profile",
        route: "/pages/profile/profile-overview",
        component: <ProfileOverview />,
      },
      {
        name: "Settings",
        key: "profile-settings",
        route: "/pages/account/settings",
        component: <Settings />,
      },
      {
        name: "Logout",
        key: "logout",
        route: "/sign-in",
        component: <SignInBasic />,
      },
    ],
  },
  { type: "divider", key: "divider-0" },
  {
    type: "collapse",
    name: "Dashboards",
    key: "dashboards",
    icon: <Icon fontSize="medium">dashboard</Icon>,
    collapse: [
      {
        name: "Analytics",
        key: "analytics",
        route: "/dashboards/analytics",
        component: <Analytics />,
      },
    ],
  },
  { type: "title", title: "Pages", key: "title-pages" },
  {
    type: "collapse",
    name: "INCIDENT",
    key: "incidents",
    icon: <Icon fontSize="medium">apps</Icon>,
    collapse: [
      {
        name: "List Incident",
        key: "list-incident",
        route: "/pages/incident/list-incident",
        component: <Incidents />,
      },
      {
        name: "Create Incident",
        key: "create-incident",
        route: "/pages/incident/create-incident",
        component: <CreateIncident />,
      },
    ],
  },
  {
    type: "collapse",
    name: "SECURITY",
    key: "security",
    icon: <Icon fontSize="medium">admin_panel_settings</Icon>,
    collapse: [
      {
        name: "Employees",
        key: "employees",
        route: "/pages/security/employees",
        component: <Employes />,
      },
      {
        name: "PIC Area",
        key: "pic-area",
        route: "/pages/security/pic-area",
        component: <SecurityPICArea />,
      },
    ],
  },
];

export default routes;
