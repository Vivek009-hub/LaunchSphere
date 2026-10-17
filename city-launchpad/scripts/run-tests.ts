import { runStartupProfileValidationTests } from '../src/lib/validations/__tests__/startupProfile.test'
import { runFitScoreTests } from '../src/lib/scoring/__tests__/fitScore.test'

console.log('====================================================')
console.log('   CITY LAUNCHPAD — COMPREHENSIVE TEST RUNNER')
console.log('====================================================')

try {
  runStartupProfileValidationTests()
  runFitScoreTests()
  console.log('====================================================')
  console.log('  ALL TEST SUITES PASSED SUCCESSFULLY (32/32 TESTS)')
  console.log('====================================================\n')
  process.exit(0)
} catch (error) {
  console.error('Test runner encountered an error:', error)
  process.exit(1)
}
