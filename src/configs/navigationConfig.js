import React from "react"
import * as Icon from "react-feather"
const navigationConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    type: "item",
    icon: <Icon.User size={20} />,
    navLink: "/dashboard"
  },
  {
    id: "portfolio",
    title: "Portfolios",
    type: "item",
    icon: <Icon.Coffee size={20} />,
    navLink: "/portfolios"
  },
  {
    id: "strategies",
    title: "Strategies",
    type: "item",
    icon: <Icon.Anchor size={16} />,
    navLink: "/strategies",
  },
  {
    id: "crypto",
    title: "Crypto",
    type: "item",
    icon: <Icon.Code size={16} />,
    navLink: "/crypto",
  },
  {
    id: "blogs",
    title: "Blog",
    type: "item",
    icon: <Icon.PenTool size={16} />,
    navLink: "/blogs",
  },
  {
    id: "knowledge_base",
    title: "Knowledge Base",
    type: "item",
    icon: <Icon.AlertOctagon size={16} />,
    navLink: "/knowledgebase",
  },
  {
    id: "account",
    title: "Account",
    type: "item",
    icon: <Icon.User size={16} />,
    navLink: "/user/view",
  },
  
]


export default navigationConfig
