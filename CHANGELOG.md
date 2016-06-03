#### 1.12.3 (2016-6-3)

##### Chores

* **package:** Update eslint version ([3ddbf84a](https://github.com/fvdm/nodejs-dotest/commit/3ddbf84a6b919a4847dec53d0c8083c68a7c0185))

##### Refactors

* **stats:** Moved end stats to done() ([cc0576a7](https://github.com/fvdm/nodejs-dotest/commit/cc0576a70b894c577111b8f93bab798b53e1515c))

##### Tests

* **script:**
  * Fail when lcov.info submit fails ([ea3060bf](https://github.com/fvdm/nodejs-dotest/commit/ea3060bf76108eaff528fc3691c19dc74646b822))
  * Removed eslint duplicity ([01db72c7](https://github.com/fvdm/nodejs-dotest/commit/01db72c7c0f1bba2f63909dc7c9d25595155d3df))
  * Rewrite test.sh ([d43d588f](https://github.com/fvdm/nodejs-dotest/commit/d43d588f0603c729d83fc6c45516e2ee266d8c0f))
  * Fix codeclimate command, check token ([fde515df](https://github.com/fvdm/nodejs-dotest/commit/fde515dfa8a585c67007aff9d17ccdac8566db7e))
  * Use bash instead of sh ([d5969db8](https://github.com/fvdm/nodejs-dotest/commit/d5969db81bed3bc91984ddc60447238e3aa32470))
  * Removed repo check ([f27985e9](https://github.com/fvdm/nodejs-dotest/commit/f27985e92961fa06711c082c7e39cf950edb69ef))
* **runner:** Use absolute test() instead of alias (#17) ([478c97f4](https://github.com/fvdm/nodejs-dotest/commit/478c97f4c24c9e2361c4383d1e3642b0011cdcce))

#### 1.12.2 (2016-6-1)

##### Bug Fixes

* **package:** Escape double quotes in string ([0066f48b](https://github.com/fvdm/nodejs-dotest/commit/0066f48b6e662eeafb49a8c0bd19487a58fcc19d))

##### Tests

* **fix:** istanbul export should be report ([257d3746](https://github.com/fvdm/nodejs-dotest/commit/257d37460ca51952963b1d27466f70333a32201f))
* **package:**
  * Move test commands to test.sh ([71912440](https://github.com/fvdm/nodejs-dotest/commit/7191244038f463371e81f989737d7d498f0c5be8))
  * Undo inline Travis branch check ([f33448b5](https://github.com/fvdm/nodejs-dotest/commit/f33448b595111ee1c01d0b6c0f397afba100fb4e))
  * Only submit lcov for master branch ([f0550acc](https://github.com/fvdm/nodejs-dotest/commit/f0550acc0a0d9d69ef743c52098256b8d711f8ae))
* **lint:** fixed 'test' is defined but never used (#16) ([9a86c782](https://github.com/fvdm/nodejs-dotest/commit/9a86c7827d4d785f00ba562905abb780d76d9af7))
* **runner:** Use absolute test() instead of alias ([b556f409](https://github.com/fvdm/nodejs-dotest/commit/b556f409d8e405ece8ac5fbafdd9af1bea0a6054))

#### 1.12.1 (2016-6-1)

##### Documentation Changes

* **badges:** Add CodeClimate coverage ([a0971a05](https://github.com/fvdm/nodejs-dotest/commit/a0971a05281650afd5d039af54e9054849ef9cb7))

##### Refactors

* **package:**
  * Add `ci-test` command with CodeClimate and Istanbul ([1bd44f52](https://github.com/fvdm/nodejs-dotest/commit/1bd44f52d42881c0d8aea8c1d1207516477a6e2c))
  * Removed bithound from test ([e703dd1a](https://github.com/fvdm/nodejs-dotest/commit/e703dd1a46a5dc3266972460c20d6fbbbc05f95d))
  * Add bithound to test and devDependencies ([f203ac90](https://github.com/fvdm/nodejs-dotest/commit/f203ac90b9c624a994ae0d53c641abbdafccae2e))

##### Tests

* **config:**
  * Disable CodeClimate duplication ([18d9effb](https://github.com/fvdm/nodejs-dotest/commit/18d9effbacdfda925fac0418c07f0bb6d1bfadef))
  * `npm run ci-test` on builds ([a3545fbe](https://github.com/fvdm/nodejs-dotest/commit/a3545fbe3d66204da5a826d8cf9374d2bc017bf7))
  * Add CodeClimate with eslint-2 ([9a5554a6](https://github.com/fvdm/nodejs-dotest/commit/9a5554a68a83c8a07f7f3d7614488a0bb8cbc7ad))
* **lint:** Allow console.log statements ([ff4812d9](https://github.com/fvdm/nodejs-dotest/commit/ff4812d96e62baba231376c8891917c90589d0c7))

### 1.12.0 (2016-5-26)

##### Documentation Changes

* **readme:** Add version badge for changelog ([bb12e164](https://github.com/fvdm/nodejs-dotest/commit/bb12e164a54ab26dce280ca25a2300963727c36f))

##### Other Changes

* **undefined:**
  * removed CodeClimate ([a469f6be](https://github.com/fvdm/nodejs-dotest/commit/a469f6befc7a32d973ea46f3d3b241485243141d))
  * added Code Climate to Travis config ([a8b9be4d](https://github.com/fvdm/nodejs-dotest/commit/a8b9be4d09a3ccf21a5d7a8a4188041a8cbe67c2))
  * changed heading style ([ef6c0d99](https://github.com/fvdm/nodejs-dotest/commit/ef6c0d99b0af9b2de0d62aac1e088da29f103947))
  * added CodeClimate config ([4d93d2fe](https://github.com/fvdm/nodejs-dotest/commit/4d93d2fe29bd68eb1f524abe48418b6225fbafb0))
  * updated eslint version ([b7d832c9](https://github.com/fvdm/nodejs-dotest/commit/b7d832c94d18c48e59ca659cf053e879f082ad94))
  * check test() return ([5ffda52b](https://github.com/fvdm/nodejs-dotest/commit/5ffda52be5ff6749d4bc93525500543746558e48))

##### Refactors

* **package:** Add example.js ([6523927d](https://github.com/fvdm/nodejs-dotest/commit/6523927de1a8ccd3eb5f3c20c0f2a5f4d8dafe3d))

