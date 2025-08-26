flowchart LR
  subgraph C1["Clients"]
    U[User (Web/Mobile)]
  end

  subgraph FE1["Frontend"]
    FE[React App / Amplify UI]
  end

  subgraph Amplify_API["API Layer"]
    GQL[(GraphQL API "jaznu")]
    REST[(REST API "jaznuRest")]
  end

  subgraph Auth["Cognito"]
    CU[User Pool]
    TRG((Signup Trigger))
  end

  subgraph Lambdas["Business Logic Lambdas"]
    L1[jaznuCognitoSignupTriggerLambda]
    L2[jaznuChangeSubscriptionPlanLambda]
    L3[jaznuHandleSubscriptionPlanLambda]
    L4[jaznuPingLambda]
  end

  subgraph Storage["Data Stores"]
    DDB[(DynamoDB tables from @model)]
    S3[(S3 buckets: images/assets)]
  end

  subgraph External["External Integrations"]
    PSP[Payment Providers (PSP)]
    RMS[Restaurant Mgmt System]
  end

  subgraph Envs["Environments"]
    DEV[dev]
    DEVMB[devmb]
    PROD[prod]
  end

  U --> FE --> GQL
  FE --> REST
  FE -->|Auth| CU
  CU -->|on signup| TRG --> L1
  GQL <-->|App data| DDB
  REST --> L2
  REST --> L3
  L2 --> DDB
  L3 --> DDB
  FE --> S3
  L2 --> PSP
  L3 --> PSP
  L2 -.optional.-> RMS
  L3 -.optional.-> RMS

  Envs -.separate stacks & resources.-> Amplify_API
  Envs -.separate stacks & resources.-> Auth
  Envs -.separate stacks & resources.-> Lambdas
  Envs -.separate stacks & resources.-> Storage
