# openGauss-connector-nodejs

#### 介绍
基于[node-postgres](https://github.com/brianc/node-postgres)的一个简单的[openGauss](https://opengauss.org)Node.js驱动.


#### 安装教程

```bash
    npm install & npm run build
```
#### 使用说明

- [配置客户端接入认证方式](https://opengauss.org/zh/docs/2.0.1/docs/Developerguide/%E9%85%8D%E7%BD%AE%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%8E%A5%E5%85%A5%E8%AE%A4%E8%AF%81.html)

- 驱动具体实现参考[node-postgres](https://github.com/brianc/node-postgres)

- SHA256 & SM3加密实现参考[openGauss-connector-jdbc](https://gitee.com/opengauss/openGauss-connector-jdbc)

- 如何使用请参考[node-postgres wiki](https://node-postgres.com)

#### 注意事项

- [安装时SEMMNI错误]

    简易安装的时候，可能会遇到以下错误
  
   `"On systemwide basis, the maximum number of SEMMNI is not correct. the current SEMMNI value is: .... Please check it."`

  根据安装脚本计算出，信号量SEMMNI应该大于321.875

  在CentOS 7 可以用一下命令修改 SEMMNI

  ```bash
  $ sudo vim /etc/sysctl.conf
  ```

  添加以下数据到文件末尾

  `kernel.sem = 250 32000 100 400`

  使用指令 `shift+ double z` 或者 `:wq`保存文件修改

  最后执行修改

  ```bash
  $ /sbin/sysctl -p
  ```

- [修改加密方式需要更新自己的密码或者新建一个用户]
  
    否则就算用户名密码都正确的情况下仍会报错非法用户名/密码(Invalid username/password, login denied)
    
  可以通过sql命令 `select rolname,rolpassword from pg_authid;` 来判断当前用户密码的加密方式。
  
  [账号锁定]
  
  openGauss账号被锁定解决办法，进入openGauss输入以下命令:
  [database_name]#  alter user [username] account unlock;
  
- [添加IPv4规则允许所有外部链接的密码都由SHA256验证]

    打开/opt/software/openGauss/data/single_node/pg_hba.conf
    添加以下数据
    add this:     `host    all        all         0.0.0.0/0           sha256 `
    详情请看[这里](https://opengauss.org/zh/docs/1.0.0/docs/Quickstart/GUC%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E.html)

- [npminstall可能会出现的错误]
    
    若在此处操作出现 `Cannot find .....` 错误,请查看自己的node版本是否为v16以上
    npm版本是否为v7以上,若不是，请安装最新版本node
  
    
#### 简单测试
修改packages/pg/test-1.js的服务器配置并执行如下指令

```bash
cd packages/pg/
node test-1.js
```