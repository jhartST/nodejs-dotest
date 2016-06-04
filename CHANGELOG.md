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

