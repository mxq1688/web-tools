// 环境配置
interface EnvConfig {
  selfHost?: string[]
  WEBSITE: string
  WEBSITEINTL: string
}

const envConfigs: Record<string, EnvConfig> = {
  development: {
    selfHost: ['localhost'],
    WEBSITE: 'http://localhost:8080',
    WEBSITEINTL: 'http://localhost:8080'
  },
  sit: {
    selfHost: [],
    WEBSITE: 'http://10.1.196.2',
    WEBSITEINTL: 'http://10.1.196.2:9080'
  },
  pre: {
    selfHost: ['117.50.60.12', 'employee-paint.mobvoi.com', 'paint-sit.mobvoi.com'],
    WEBSITE: 'http://117.50.60.12',
    WEBSITEINTL: 'http://36.255.222.163'
  },
  production: {
    selfHost: ['paint.weta365.com', 'paint.mobvoi.com', 'paint.moyin.com'],
    WEBSITE: 'https://www.yuan365.com',
    WEBSITEINTL: 'https://intl.yuan365.com'
  },
  prd_intl: {
    WEBSITE: 'https://www.yuan365.com',
    WEBSITEINTL: 'https://intl-sit.yuan365.com'
  }
}

// 获取当前环境
const env = import.meta.env.MODE || 'development'
const customEnv = import.meta.env.VITE_APP_ENV as string

// 根据环境变量选择配置
const config = envConfigs[customEnv] || envConfigs[env] || envConfigs.development

// 生产环境禁用 console
if (env === 'production' || customEnv === 'production') {
  console.log = function () {}
  console.error = function () {}
  console.dir = function () {}
}

export default config

