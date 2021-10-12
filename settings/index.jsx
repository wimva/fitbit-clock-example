registerSettingsPage((props) => {
  let screenWidth = props.settingsStorage.getItem('screenWidth');
  let screenHeight = props.settingsStorage.getItem('screenHeight');

  return (
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
        <Toggle settingsKey="toggle" label="Example" />
        <ImagePicker
          title="Background Image"
          description="Pick an image to use as your background."
          label="Pick a Background Image"
          sublabel="Background image picker"
          settingsKey="background-image"
          imageWidth={screenWidth}
          imageHeight={screenHeight}
        />
      </Section>
    </Page>
  );
});
