# openGauss-connector-nodejs

#### Description
A simple [openGauss](https://opengauss.org) connector for Node.js based on [node-postgres](https://github.com/brianc/node-postgres).

#### Installation

```bash
npm install & npm run build
```

#### Instructions

- [Configure the client access authentication method](https://opengauss.org/zh/docs/2.0.1/docs/Developerguide/%E9%85%8D%E7%BD%AE%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%8E%A5%E5%85%A5%E8%AE%A4%E8%AF%81.html)
- [Please refer to here for specific implementation]
  (https://github.com/brianc/node-postgres)
- [Refer to the JDBC driver for encryption]
  (https://gitee.com/opengauss/openGauss-connector-jdbc)

- [How to Use]
   (https://node-postgres.com)

#### Posts


- [SEMMNI ERROR]

  When doing simpleinstall, we may get this error
  
  `"On systemwide basis, the maximum number of SEMMNI is not correct. the current SEMMNI value is: .... Please check it."`

  According to the installation script, SEMMNI should be greater than 321.875

  On CentOS 7 we can do this to modify it
  ``` bash
  $ sudo vim /etc/sysctl.conf
  ```
  Add this line to the end of file

  `kernel.sem = 250 32000 100 400`

  Then use `shift + double z` or `:wq` to save and exit the `vim`

  Finally execute it to apply our settings
  ``` bash
  $ /sbin/sysctl -p 
  ```

- [To change the encryption mode, you need to update your password or create a new user]

  Otherwise, an invalid user name or password will be displayed even if both the user name and password are correct(Invalid username/password, login denied)

  You can run the SQL command 'select rolname,rolpassword from pg_authID; 'to determine the encryption mode of the current user password.

- [The account was locked]

  Enter the gsql on your server

  Then run this

  alter user <i>`[username]`</i> account unlock;

- [Adding IPv4 rules allows all external links to the password to be verified by SHA256]

  Open this file: `/opt/software/openGauss/data/single_node/pg_hba.conf`

  add this:     `host    all        all         0.0.0.0/0           sha256 `

- [GUC]
  
  Click [here](https://opengauss.org/zh/docs/1.0.0/docs/Quickstart/GUC%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E.html)

- [Errors that may occur with NPM]
  
  If 'Cannot find.....' appears in this operation ` errors.
  Check whether the node version is later than V16.
  Check whether the NPM version is V7 or later. If not, install node of the latest version.