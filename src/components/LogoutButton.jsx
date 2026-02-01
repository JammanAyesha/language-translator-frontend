function LogoutButton() {
  const logout = () => {
    localStorage.removeItem("access");
    window.location.href = "/login";
  };

  return (
    <button className="btn btn-danger" onClick={logout}>
      Logout
    </button>
  );
}

export default LogoutButton;
