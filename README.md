# Comcamp 22 Website Maejo University
This project is the official website for Comcamp 22, an annual computer camp held at Maejo University. The website provides information about the camp, including the schedule, speakers, and registration process.

If you're seeing this, you've probably already done this step. Congrats!
## What is Comcamp?
Comcamp is a youth computer camp that is held annually at Maejo University. The camp is designed to introduce high school students to computer science and programming. The camp is also a great opportunity for students to meet other students who are interested in computer science.



## The Promote web page
Web page promoter for Comcamp CS-MJU, Section would include the following
- Index 
- About Comcamp
- Learning Scope
- Statistic
- Review
- Benefits
- Timeline
- FAQ
- Contact

## Authentication
Handle Authentication for User and Admin

## User Information Registration

## User Dashboard
User can handling their personal information and evidence, and managing their notification. Which can be list as the following
- User Information
- User Evidence Handle
- User Notification 

## Admin Control Dashboard
Admin can handling all evidence and message request from user, also sending the message back to the user, and can managing user list
- Request List
- Sent-back List
- User List

## Changelog
These list include keep track only important changed, Which can be list as the following 

### 1.0.0 Created:Init Promote web page
### 1.0.1 Patch: fixed TikTok widget in Contact Section on Promote web page
### 1.0.2 implemented: Authentication implementation
- Init: Firebase init
- Created: User Authentication
- Created: Admin Authentication
### 1.0.3 implemented: User Information Registration implementation  
- Created: User Authentication
### 1.0.4 implemented: User Dashboard implementation
- Add: user information handler
- Add: payment proof evidence sending system   
- Add: parent permission proof evidence sending system   
- Add: image and file storage system (Cloudinary)
- Add: user notification handler 
### 1.0.5 implemented: Admin Control Dashboard implementation
- Add: request handler (user's evidence request)
- Add: sent-back handler handler 
- Add: User list
- implemented: filter list on request and User list. 
- implemented: sorting properties on request and User list. 
### 1.0.6 patch & implemented: User and Admin features implementation
#### Patch
- Patched: Correct word mistakes
- Patched: UI improvement
- Patched: Input placeholder for user information register 
- Add: Add proofs for payment and parent submission
- Interface implemented: UserInfo had contacts object contained such an LineId, Facebook Link, parent telephone and other contact
- Implemented: Edit UserInfo feature
- Implemented: UserInfo Adapting on Admin Dashboard
- Implemented: Delete User feature that will associated to Notification, List, Cloudinary assets, and (not now) User Credential
<!-- list me what changes  on this stage changed commit -->
### 1.0.7 patch & implemented: Board & assets implementation
- Patched: Update & add new error handling
- Patched: fixed user info register form data
- Implemented: Add Public relations board
  - Add Board Template components
  - Add Board Editor
  - Add path to navigate to Public relations board -> "/dashboard/public-relation" for user
- Implemented: Add Sponsors logo
- Implemented: Countdown widget on Index page

# create-svelte
[![Build status](https://github.com/moking55/csmju-comcamp-22nd-promote/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/moking55/csmju-comcamp-22nd-promote/actions/workflows/main.yml)

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).
<center>
<img src='https://cdn.discordapp.com/attachments/1038649242278965248/1180267703588634748/comcamp-22nd-logo.png?ex=657cccf4&is=656a57f4&hm=4bb4f4be0e390991288cad50b3a2cbd9ea6d0d571db9677d143c9bce2826ac71&' height='250px'>
</center>

## Creating a project


```bash
# create a new project in the current directory
npm create svelte@latest
## Benefits of attending Comcamp
There are many benefits to attending Comcamp. Some of the benefits include:

# create a new project in my-app
npm create svelte@latest my-app
```
- Learning about computer science and programming
- Meeting other students who are interested in computer science
- Getting hands-on experience with computer science
- Developing problem-solving skills

## Developing
You will also get the opportunity to work on hands-on projects with other students.

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## About this Project
This project was created by [Traiphakh Sitthikaew](https://github.com/textures1245) with contributions from [Maythawat Mahawan](https://github.com/textures1245). The project is built using sveltekit kit, Daisy UI and is hosted on CSMJU faculty
