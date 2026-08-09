import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SwitchAccount() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const savedAccounts =
      JSON.parse(
        localStorage.getItem("savedAccounts")
      ) || [];

    setAccounts(savedAccounts);
  }, []);

  const handleSwitch = (account) => {
    localStorage.setItem(
      "token",
      account.token
    );

    localStorage.setItem(
      "userId",
      account.userId
    );

    navigate("/");
    window.location.reload();
  };

  const handleRemove = (userId) => {
    const updatedAccounts =
      accounts.filter(
        (account) =>
          account.userId !== userId
      );

    localStorage.setItem(
      "savedAccounts",
      JSON.stringify(updatedAccounts)
    );

    setAccounts(updatedAccounts);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        width: "90%",
        margin: "30px auto",
        padding: "25px",
        border: "1px solid #f0f0",
        borderRadius: "12px",
        boxSizing: "border-box",

      }}
    >
      <h1>Switch Account</h1>

      {accounts.length === 0 ? (
        <p>
          No other accounts saved.
        </p>
      ) : (
        accounts.map((account) => (
          <div
            key={account.userId}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              padding: "15px",
              marginBottom: "10px",
              border:
                "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <div>
              <strong>
                {account.name}
              </strong>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#666",
                }}
              >
                {account.email}
              </p>
            </div>

            <div>
              <button
                onClick={() =>
                  handleSwitch(account)
                }
                style={{
                  padding:
                    "8px 15px",
                  marginRight: "8px",
                  border: "none",
                  borderRadius:
                    "6px",
                  background:
                    "#1877f2",
                  color: "white",
                  cursor:
                    "pointer",
                }}
              >
                Switch
              </button>

              <button
                onClick={() =>
                  handleRemove(
                    account.userId
                  )
                }
                style={{
                  padding:
                    "8px 15px",
                  border: "none",
                  borderRadius:
                    "6px",
                  background:
                    "#ff416c",
                  color: "white",
                  cursor:
                    "pointer",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default SwitchAccount;