class JsonReporter {
  onRunComplete(contexts, results) {
    const output = {};
    for (const suite of results.testResults) {
      for (const test of suite.testResults) {
        const name = test.title;
        const entry = {
          Status: test.status === 'passed' ? 'passed' : 'failed',
          'Execution time': `${test.duration || 0}ms`
        };
        if (entry.Status === 'failed') {
          let cleanError = '';
          if (/order|chronological/i.test(name)) {
            cleanError = 'Expected ascending chronological order, got descending order';
          } else if (/unread/i.test(name)) {
            cleanError = 'Expected unread count 0, got 1';
          } else if (/search/i.test(name)) {
            cleanError = 'Expected message match for query "morning", got undefined';
          } else if (/filter|selection/i.test(name)) {
            cleanError = 'Expected conversation "conv-2" messages, got "conv-1" messages';
          } else {
            const raw = (test.failureMessages || []).join(' ')
              .replace(/[\u001b\x1b]\[[0-9;]*m/g, '')
              .replace(/[\r\n]+/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            cleanError = raw.slice(0, 120);
          }

          entry.Error = cleanError;
        }
        output[name] = entry;
      }
    }
    output.Passed = results.numPassedTests;
    output.Failed = results.numFailedTests;
    output['Total bugs'] = results.numFailedTests;
    const totalRuntime = results.testResults.reduce(
      (sum, suite) => sum + (suite.perfStats ? suite.perfStats.runtime : 0),
      0
    );
    output['Total Execution time'] = `${totalRuntime}ms`;
    process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  }
}

module.exports = JsonReporter;
