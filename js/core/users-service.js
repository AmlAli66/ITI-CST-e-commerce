export async function initUsers() {
    const existingUsers = localStorage.getItem("users");


    if (existingUsers) return;

    try {
        const response = await fetch("/data/users.json");


        if (!response.ok) {
            throw new Error("Failed to fetch users.json");
        }

        const users = await response.json();

        const formattedUsers = users.map(user => ({
            ...user,
            isMain: user.role === "admin" && user.id === "1"
        }));


        localStorage.setItem("users", JSON.stringify(formattedUsers));

        console.log("Users loaded from JSON ✔");

    } catch (error) {
        console.error("Error loading users:", error);
    }
}


export function resetUserPassword(userId) {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.id == userId);
    if (!user) return null;

    const newPassword = generateStrongPassword();
    user.password = newPassword;

    localStorage.setItem("users", JSON.stringify(users));

    logAdminAction("Reset Password", user);

    return { user, newPassword };
}

function generateStrongPassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
    let password = "";

    for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
}


export function logAdminAction(action, targetUser) {
    const logs = JSON.parse(localStorage.getItem("adminLogs")) || [];

    logs.unshift({
        action,
        target: targetUser.email,
        date: new Date().toISOString()
    });

    localStorage.setItem("adminLogs", JSON.stringify(logs));
}
