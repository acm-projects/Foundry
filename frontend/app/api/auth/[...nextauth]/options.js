import { sign } from "crypto";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { Pool } from "pg";
import axios from 'axios'

const clientId = process.env.GITHUB_ID;
const clientSecret = process.env.GITHUB_SECRET;
const databaseUrl = process.env.DATABASE_URL;

const pool = await new Pool({
    connectionString: databaseUrl,
    ssl: {
        rejectUnauthorized: false
    }
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


async signIn({ user,account,profile }) { 
    console.log("User signed in", user);
    console.log("Account", account);
    console.log("Profile", profile);

    console.log("profile login",profile?.login)

    const username = profile?.login || user.name

  try { 

    await pool.query(`INSERT INTO users (id, name, username ,email)
        VALUES ($1, $2, $3, $4) 
        ON CONFLICT (id) DO NOTHING`,

       [user.id, user.name, username, user.email]);


  }catch(err) { 

    console.error("something went wrong",err)
  }


}




 }

}
