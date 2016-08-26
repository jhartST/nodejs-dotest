#### 1.13.5 (2016-8-26)

##### Bug Fixes

* **runner:** Yet another ancient npm fix attempt ([10a8a634](https://github.com/fvdm/nodejs-dotest/commit/10a8a63401dd72b0e062480e71bffe6555048fa0))

#### 1.13.4 (2016-8-26)

##### Chores

* **runner:** Added code comments ([1ae4f3ec](https://github.com/fvdm/nodejs-dotest/commit/1ae4f3ece72c17d0779366616d3ca3dbbbb94a31))

##### Bug Fixes

* **runner:** Fixed bin paths for old npm v2 ([d8c34f5d](https://github.com/fvdm/nodejs-dotest/commit/d8c34f5d289e1f5d088ea95873845f4244ff4d68))

#### 1.13.3 (2016-8-26)

##### Bug Fixes

* **runner:** Another attempt to fix node v4 paths ([0c550010](https://github.com/fvdm/nodejs-dotest/commit/0c5500102323dff182e8b353f2fbe8edf8c06fe0))

#### 1.13.2 (2016-8-26)

##### Bug Fixes

* **compat:** Fixed global bins for node v4 ([7d3ac8aa](https://github.com/fvdm/nodejs-dotest/commit/7d3ac8aab15caaa28dbd814808950323ac0b2019))

#### 1.13.1 (2016-8-26)

##### Bug Fixes

* **compat:** Fixed paths for node v4 ([10d61aa9](https://github.com/fvdm/nodejs-dotest/commit/10d61aa953f244c861194778369b470b9992cc10))

### 1.13.0 (2016-8-26)

##### Chores

* **package:**
  * Update npm keywords ([d0a6912f](https://github.com/fvdm/nodejs-dotest/commit/d0a6912f445239a5ce085e265eab71b27b298bda))
  * Update npm description ([c62e341c](https://github.com/fvdm/nodejs-dotest/commit/c62e341cd910f0b7582b13bf0777c1a95786beea))
  * Update dependencies ([15f1e916](https://github.com/fvdm/nodejs-dotest/commit/15f1e91682c130a4699d470b6acd11d866ae1c1d))
  * update eslint to version 3.0.0 (#18) ([573af080](https://github.com/fvdm/nodejs-dotest/commit/573af08094a671ee3ea74bd685740a0ea99e13af))
  * Remove obsolete Codeclimate config ([3def9bf7](https://github.com/fvdm/nodejs-dotest/commit/3def9bf79c27ba3085075da49b22486b1872f542))
  * Update eslint version ([2c299435](https://github.com/fvdm/nodejs-dotest/commit/2c299435384a343f79ed7a3a904b1d6a0d309c10))
  * Minor clean up ([10ac84f5](https://github.com/fvdm/nodejs-dotest/commit/10ac84f5e162f2c5eb92fb7c80e8e6d28c226a4e))

##### Documentation Changes

* **badges:** Added bitHound status badges ([a32eb1b1](https://github.com/fvdm/nodejs-dotest/commit/a32eb1b14c491d30b27d72bac93724642b51bde4))
* **readme:**
  * Fixed minor typo ([2fe25b2c](https://github.com/fvdm/nodejs-dotest/commit/2fe25b2c4a85411117fd3a83911f96adc857e5e8))
  * Describe new test runner ([77e9aeaf](https://github.com/fvdm/nodejs-dotest/commit/77e9aeaf86565d208c52a6c5c85392f4cf38c939))

##### New Features

* **package:**
  * Install global dotest command ([5f392384](https://github.com/fvdm/nodejs-dotest/commit/5f392384d7954df20153821a2bbdb30f48bb8040))
  * Include test.sh in release ([55f31838](https://github.com/fvdm/nodejs-dotest/commit/55f31838c39d611398c6b855eb1adbe37d5e8c38))

##### Refactors

* **main:** Also strip test suffix from package dir ([fbdc4357](https://github.com/fvdm/nodejs-dotest/commit/fbdc4357aafbcefac7415fd4b7a28d05e49ec662))
* **package:**
  * Dev deps are now the main deps ([0cf24b47](https://github.com/fvdm/nodejs-dotest/commit/0cf24b4784113461938707dc9f121c9b1d8c5fa8))
  * Minimum supported node v4.0 ([575254ed](https://github.com/fvdm/nodejs-dotest/commit/575254edef8d2e493d4491038b3884d001a43b6e))

##### Tests

* **eslint:** Warn on underscore dangle ([73ba0fea](https://github.com/fvdm/nodejs-dotest/commit/73ba0fea4f2a35cc1220996d36c7de2baf553542))
* **runner:**
  * Only lint package scripts ([84101c27](https://github.com/fvdm/nodejs-dotest/commit/84101c27c1693c9dca5dbea71e48b3541170209e))
  * Log commits since last release ([77b4a1aa](https://github.com/fvdm/nodejs-dotest/commit/77b4a1aa3d64577a6576e7c7ec641baa45db89b2))
  * More verbose console ([ba45f2e8](https://github.com/fvdm/nodejs-dotest/commit/ba45f2e8701ef351f43e49fa18f635265f1db5a1))
* **lint:** Update eslint to ES6 ([242eef65](https://github.com/fvdm/nodejs-dotest/commit/242eef6591c9e2e7653cf44878b41c4560451eee))

#### 1.12.4 (2016-6-4)

##### Documentation Changes

* **badges:** Replace CodeClimate with Coveralls ([eda18174](https://github.com/fvdm/nodejs-dotest/commit/eda18174511eef0f3ecdb4002a6d7153d9f8fb6d))

##### Refactors

* **package:** Replace CodeClimate with Coveralls ([ce460ad9](https://github.com/fvdm/nodejs-dotest/commit/ce460ad9cbe6253d87bbff4589d2d9b8feefa7e3))

##### Tests

* **runner:**
  * Add warnings for better coverage ([2eeefa87](https://github.com/fvdm/nodejs-dotest/commit/2eeefa87181c64993f34471d6cde22ca9ac3f9b0))
  * More correct .config() test ([c1aeb531](https://github.com/fvdm/nodejs-dotest/commit/c1aeb531adca8c13b211d7707ed550714f08a2cf))
  * Fixed missing testDone's ([9cf79d96](https://github.com/fvdm/nodejs-dotest/commit/9cf79d962192f8a0c97ad6edd01aab8607f1deb4))
  * Check if all tests did run ([66d7352f](https://github.com/fvdm/nodejs-dotest/commit/66d7352fe0c4391f6cead609e6aabae003f9830f))
  * Cover and log testsDone ([63a2fb0d](https://github.com/fvdm/nodejs-dotest/commit/63a2fb0d14a122a3ba49566ddb85aec1e0425ba4))
  * Removed onExit() test ([84293ed0](https://github.com/fvdm/nodejs-dotest/commit/84293ed0f224dee5dd38d46068e505961ee1f9a5))
  * Fixed some erros and bad refs ([80e0c510](https://github.com/fvdm/nodejs-dotest/commit/80e0c510420a4b99ebcbd79713994a221b45c510))
  * No need to check .config() second prop on argument ([0b4f5353](https://github.com/fvdm/nodejs-dotest/commit/0b4f535349a1021f9d7b50c6f69cc87685a2be44))
  * Fixed isNotEmpty's being empty ([0741408c](https://github.com/fvdm/nodejs-dotest/commit/0741408c01ce33e0fe10aacbedc3695d13eb543f))
  * Fixed setConfig() is config() ([52eb69ff](https://github.com/fvdm/nodejs-dotest/commit/52eb69ff747cf5668555c261d1b2de9f8ea076b8))
  * Add .setConfig() and argument tests ([c9102d44](https://github.com/fvdm/nodejs-dotest/commit/c9102d44d7da71289171edcf7a007b587eb644f0))
* **config:** Warn instead of fail on undefined ([783c2c83](https://github.com/fvdm/nodejs-dotest/commit/783c2c83dc676b009ab43fa93881c82bcabd2799))
* **lint:** Fixed missing semicolons ([99db13ed](https://github.com/fvdm/nodejs-dotest/commit/99db13ed2fc7f34ed06ffc1d67c71bc5fa9d1671))
* **script:**
  * Only check we're on Travis ([3f0fb69c](https://github.com/fvdm/nodejs-dotest/commit/3f0fb69ce4abb5a95237cd575b207bb19af72620))
  * Replace CodeClimate with Coveralls ([c1ed3347](https://github.com/fvdm/nodejs-dotest/commit/c1ed33478099937f356f86a317c740860641e386))

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

