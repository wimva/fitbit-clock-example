registerSettingsPage((/* { settings } */) => (
  <Page>
    <Section title="Hi!">
      <Text>Hello world!</Text>
    </Section>
    <Section title="Pick a letter">
      <Select
        label="Select a letter"
        settingsKey="letter"
        options={[
          { name: 'A', value: 'A' },
          { name: 'B', value: 'B' },
          { name: 'C', value: 'C' },
          { name: 'D', value: 'D' },
          { name: 'E', value: 'E' },
          { name: 'F', value: 'F' },
          { name: 'G', value: 'G' },
          { name: 'H', value: 'H' },
        ]}
      />
    </Section>
  </Page>
));
