import { Button, Card, Checkbox, Input, Spacer } from '@nextui-org/react';
import React from 'react';

export default function FormComponent({ height, width, stateTrack }) {
  return (
    <div>
      <div
        className="flex items-center justify-center"
        style={{
          height: '100%',
          width: width,
        }}
      >
        <Card
          className="backdrop -blur-sm rounded-lg border-solid
        border-l-success-50 bg-white p-[5%] shadow-lg"
          style={{ width: '100%', height: '100%' }}
        >
          <div style={{ width: '100%', height: '100%' }}>
            <h1 className="text-center font-bold">NextUI Login</h1>
            <Spacer y={3} />
            <Input
              clearable
              underlined
              fullWidth
              color="success"
              size="xl"
              placeholder="Email"
            />
            <Spacer y={3} />
            <Input
              clearable
              underlined
              fullWidth
              type=""
              color="success"
              size="xl"
              placeholder="Password"
            />
            <Spacer y={3} />

            <div className="flex items-center justify-between">
              <Spacer y={3} />

              <Checkbox color="success">
                <p size={14}>Remember me</p>
              </Checkbox>
              <p size={14}>Forgot password?</p>
              <Spacer y={3} />
            </div>
            <Spacer y={2} />
            <Button color="success" variant="bordered">
              Sign in
            </Button>
            <Spacer y={2} />
          </div>
        </Card>
      </div>
    </div>
  );
}
