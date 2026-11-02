/**
 * API配置
 * 部署后需要修改此文件，填入你的Cloudflare Worker URL
 */

// Cloudflare Worker API地址
export const API_BASE_URL = 'https://peach-blossom-fortune.peach-blossom-fortune.workers.dev';

// API路径
export const API_PATH = '/api/analyze';

// 完整的API地址
export const API_ENDPOINT = `${API_BASE_URL}${API_PATH}`;
