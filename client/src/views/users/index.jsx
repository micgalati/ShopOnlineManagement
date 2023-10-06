import { useContext, useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { StyledTabs, StyledTab } from "../../components/StyledTabs";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
/* import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined"; */
import Header from "../../components/Header";
import { AuthContext } from "../../utils/AuthContext";
import ProfilesAPI from "../../api/profiles/profilesApi";
import { dataGridStyles } from "../../styles/dataGridStyles";

const Users = () => {
  const theme = useTheme();
  const [currentUser] = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [experts, setExperts] = useState([]);

  const userRole = {
    Customer: 0,
    Expert: 1,
    Manager: 2,
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let usersData = [];
        let managersData = [];
        let expertsData = [];
        if (currentUser.role === "Manager" || currentUser.role === "Expert") {
          usersData = await ProfilesAPI.getAllCustomers();
          managersData = await ProfilesAPI.getAllManagers();
          expertsData = await ProfilesAPI.getAllExperts();
        }
        setUsers(usersData);
        setExperts(expertsData);
        setManagers(managersData);
      } catch (error) {
        // Gestisci gli errori, ad esempio mostrando un messaggio di errore
      }
    };
    fetchUsers();
  }, [currentUser.role, currentUser.id]);

  const [roleFilter, setRoleFilter] = useState(userRole.Customer);

  const columns = getUsersColumns(roleFilter, userRole);

  const handleRoleFilterChange = (event, newValue) => {
    setRoleFilter(newValue);
  };

  return (
    <Box m="20px">
      <Header title="USERS" subtitle="Manage users" />
      <Box m="40px 0 0 0" height="70h" sx={dataGridStyles(theme)}>
        {/* TODO: change datagrid content according to the selected tab */}
        <StyledTabs value={roleFilter} onChange={handleRoleFilterChange}>
          <StyledTab label="Customers" />
          <StyledTab label="Experts" />
          <StyledTab label="Managers" />
        </StyledTabs>
        <DataGrid
          rows={
            roleFilter === userRole.Customer
              ? users
              : roleFilter === userRole.Expert
              ? experts
              : managers
          }
          columns={columns}
          loading={!users.length}
          getRowId={(row) => row.id}
          slots={{
            toolbar: GridToolbar,
          }}
          sx={{
            height: "70vh",
          }}
        />
      </Box>
    </Box>
  );
};

const getUsersColumns = (roleFilter, userRole) => {
  let columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "surname",
      headerName: "Surname",
      flex: 1,
      cellClassName: "surname-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      cellClassName: "email-column--cell",
    },
  ];
  if (roleFilter === userRole.Manager) {
    columns.push({
      field: "managedArea",
      headerName: "Managed Area",
      flex: 1,
      cellClassName: "managed_area-column--cell",
    });
  } else if (roleFilter === userRole.Expert) {
    columns.push({
      field: "specialization",
      headerName: "Specialization",
      flex: 1,
      cellClassName: "specialization-column--cell",
    });
  }
  return columns;
};

export default Users;
