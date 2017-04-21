export function mockAComment() {
  return {
    user: `test-user-${Math.random().toString(36).substring(7)}@gmail.com`,
    uri: `https://minghe.me/${Math.random().toString(36).substring(7)}.html`,
    text: `test-comment-text-${Math.random().toString(36).substring(7)}`,
  }
}
