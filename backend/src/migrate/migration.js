import fs from 'fs'
import path from 'path'

import Dal from '../server/dal'

class Migration {
  constructor(config) {
    this.dal = new Dal(config)
    this.env = config.env || 'dev'
  }

  async up() {
    await this.dal.setup()

    const { policy, appinspects, vettings } = this.loadData()
    try {
      const createdPolicy = await this.dal.policy.add(policy, 'test')
      if (createdPolicy) {
        await this.dal.policy.publish(createdPolicy._id, 'test')
      }
    } catch (e) {
      console.warn(e)
    }

    for (const appinspect of appinspects) {
      await this.dal.appInspect.add(appinspect)
    }

    for (const vetting of vettings) {
      await this.dal.vetting.add(vetting)
    }

    await this.dal.close()
  }

  async down() {
    await this.dal.setup()
    await this.dal._dropDB()
    await this.dal.close()
  }

  loadData() {
    const policyPath = path.join(__dirname, '../../src/migrate', `samples/${this.env}/policy.json`)
    const policy = JSON.parse(fs.readFileSync(policyPath))
    const appinspectFiles = [
      'appinspect1.json',
      'appinspect2.json',
      'appinspect3.json',
      'appinspect4.json',
    ]
    const appinspects = []
    for (const af of appinspectFiles) {
      if (this.env === 'test') break
      const appinspectPath = path.join(__dirname, '../../src/migrate', `samples/${this.env}/${af}`)
      const appinspect = JSON.parse(fs.readFileSync(appinspectPath))
      appinspects.push(appinspect)
    }
    const vettings = []
    // TODO NO VETTINGS TO ADD
    return { policy, appinspects, vettings }
  }
}

export default Migration
