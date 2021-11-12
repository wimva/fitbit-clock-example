registerSettingsPage((/* { settings } */) => (
  <Page>
    <Section title="Pick a quote">
      <Select
        label="Select a quote"
        settingsKey="letter"
        options={[
          { name: 'Option 1.', value: 'Have to pee yet?' },
          { name: 'Option 2.', value: 'Dont eat yellow snow!' },
          { name: 'Option 3.', value: 'Tea makes me pee.' },
          { name: 'Option 4.', value: 'Never miss a time to pee!' },
          { name: 'Option 5.', value: 'Eat, sleep, pee, repeat...' },
        ]}
      />
    </Section>
  </Page>
));
