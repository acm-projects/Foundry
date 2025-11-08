import { sign } from "crypto";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { Pool } from "pg";
import axios from 'axios'

const clientId = process.env.GITHUB_ID;
const clientSecret = process.env.GITHUB_SECRET;
const databaseUrl = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test database connection on startup
pool.connect()
    .then(client => {
        console.log("✅ Database connection successful");
        client.release();
    })
    .catch(err => {
        console.error("❌ Database connection failed:", err.message);
        console.error("Connection string format: postgresql://user:password@host:port/database");
    });

if(!clientId || !clientSecret) {    

   
 throw new Error("Missing GITHUB_ID or GITHUB_SECRET");
    }
    
export const authOptions = { 

providers: [
    GithubProvider({ 
    clientId,
    clientSecret,
 })],
 session: { 
    strategy: "jwt",
 },
 callbacks: {

async jwt({ token, account,profile }) {  
    if (account) { 
        token.accessToken = account.access_token; 
    }

if(profile) { 
  token.id = profile.id;
    token.login = profile.login;
    token.name = profile.name;
    token.email = profile.email;
    token.image = profile.avatar_url;
}

 return token;


},async session({ session, token }) { 

session.user.id = token.id;
session.user.login = token.login;
session.user.name = token.name;
session.user.email = token.email;
session.user.image = token.image;

session.accessToken = token.accessToken;



 return session;
}
 },events: {


async signIn({ user, account, profile }) { 
    console.log("=== SIGN IN EVENT ===");
    console.log("User signed in", user);
    console.log("Account", account);
    console.log("Profile", profile);

    // Note: In signIn event, profile is minimal. Get username from user object instead
    // The username will be stored in the JWT from the profile in the jwt callback
    const username = user.name || user.email?.split('@')[0];
    
    // Convert user.id to integer (GitHub IDs are strings but database expects integer)
    const userId = parseInt(user.id, 10);
    
    console.log("Using username:", username);
    console.log("Attempting to insert user into database...");
    console.log("User ID:", userId, "Type:", typeof userId);

  try { 
    const result = await pool.query(`INSERT INTO users (id, name, username, email)
        VALUES ($1, $2, $3, $4) 
        ON CONFLICT (id) DO NOTHING
        RETURNING *`,
       [userId, user.name, username, user.email]);

    if (result.rowCount > 0) {
      console.log("✅ User successfully inserted into database:", result.rows[0]);
    } else {
      console.log("ℹ️ User already exists in database (ON CONFLICT triggered)");
    }

  }catch(err) { 

    console.error("❌ Database error during signIn:");
    console.error("Error message:", err.message);
    console.error("Error code:", err.code);
    console.error("Error detail:", err.detail);
    console.error("Full error:", err);
    // Don't block sign-in even if database fails
  }
  
  return true; // Allow sign-in to proceed
}




 }

}
