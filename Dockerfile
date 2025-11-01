# 基础镜像使用node
FROM node:lts as build-stage

# 设定工作目录
WORKDIR /app

# 复制package.json文件和package-lock.json文件
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建应用
RUN npm run build

# 生产阶段，使用nginx
FROM nginx:stable as production-stage

# 从构建阶段拷贝构建结果到nginx目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]