export const firebaseService = {
  type: 'service_account',
  project_id: __DEV__ ? 'sns-chat-dev' : 'snschat-fb64b',
  private_key_id: __DEV__ ? 'de883bbdad9897b8db4bc25d2bb2c33cda963fc5' : 'fff4e9878722503cb5e8bcfd7536ea3cda4a7e16',
  private_key: __DEV__
    ? '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDBj6OBjfPF0qxy\nDl4CgLO8dzxB9hPcY2+WB8ckC0lT7r5eR9i3HYwWy97Ro0qRxfi20COzmxCgeKFd\nivGZk5p8egoDOMKrTMq/SfSzSqp8fValunQn0R4bAW0eLauKiRoyliV/ebqKoKrX\nRKWx+TP0bjMRjrASvSZeKIniSUARO/qFsjYCZUX1FxrwNUDl4pQ0NDtBsJZq8XuC\n8fk+XJpbhSmbBeTfbOSGds6Mq55TvdVd89/IidIPpU0BkA9PupcJIO1d2KnlIzgs\nI/1u6e4LTniMGL5XQv9tjLOFrT0gcXNu4hz+afbWuN8wmBSoQ8nEesYewQBX/DhP\nwCkFrADBAgMBAAECggEACFQp8PUuvCBoky/TE8B9+2oWCbCRAja1InuLMh3aNeZc\nAqqMxLRcxs5W9CZWmxctsJAcOSo++Oi36NKFutoDF8AYljLnDX/saXbBNMXNuDWc\neN0hCmWRKhBRpa7JZtina+3SBz4xrK1lLIYjqxjSB36GbAb7xJKnB/4ukLIeM5+R\n4kmCVsbwRAQ54m7GdRLiyoxxkwx5IlH296yVuIhas0Jf6FYRFmWnAK1ZWirL85Pk\nAL7Qt2/3pT6T3JUqspUpcaj+ID61EPXOTeQopNTsqfCKZTil9IFBqHgKsFn4aMAO\nbb21r5Y5kDSjOI6u5H9Buhz4N/8ADyahBW2QE60GEQKBgQDs+YEK/U7axzdGNhBE\n0Iy8DXvB+HRH99UgrN8DoqtQKjdJ1d2BgeYjp8ypA/qmu06R5vb00dca/AoP5KgT\nj5doVnLs4JfXpeLLqasYPPerqLIaphTvgoEXp3euYJ2jloXO1qCNtLxD66d1pEeJ\n9V0ck9zNJOdJ3R57/8Xmd/z7bwKBgQDRGd06+KAg1Zdlu+ZyeW9GaODE3HoFNXZK\ntcwGNdSVB8+VcozX4or72NKhw93NQga5DuEwHX1rcAAV+N0ntfuZj/ZIRlirD2wQ\nqusMUnwb/16bGx4HApULkOmFp1yDJDRXczSKFh+dRgLwhT4SlJEkK0nhSRTlfYbv\nJOUP951uzwKBgDEcbD/oy0TP8IaegbShO+llKfbDFOYtWIATE4zfU32joh2tMuC6\nGQXeqq2EY5fWTawzH48RRfETtsogayzSn2BCOkMZMJ7ChEQM/6ZgTDvJFFAthz0z\n4KkUTdtXrpPOiCCbnl5/zFyPI/9fcmwG66sWgbYKJdzK9JxiH5Np3oYFAoGBAIV6\nWDGrwjQThJiJkLqkb/bnPgwMncuza/aXBE02kaQsn0NMI0IwN/46U4K10GGVc0sw\nh2k6efRaQ4PDIBGYZqqJLnLGjRVtO9OL940fHmCU7GRgtBNPf6spbxhFVJXWR59H\nSFOZecbgiUHWHGCp+9i11Wx9RVyVe8wuphZCP3obAoGBAJUqXr9VABlsavWVx+Bd\nnK7KakMXMZqhET2v7wGdo5zQXGvp3Na1gof9Bho4UzrvDGb/hG6XkayWCoAvqR8k\nwtBEE5Xb6KTSc+vsMUk9D7EZ7dvAk19pV+vFPHYqSB/hjxVTuD2m9YrHcRy6ar0A\nU75Ex9VrK5m3lKGh6psXa3lL\n-----END PRIVATE KEY-----\n'
    : '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDfmkRHV0XNHp7A\nY9y7MrAwlf/7d0CfBzym1oQJUpDD1GfDvdJ45PYmgpUHgR7tfkTYnvHTajTpdIsL\nu9Tvl0nscGoXbDN+dFoDEHvC4l18gwAWa0iLAyYwAfUIF5iCcLCyxzjtUVujjdkK\nyih5rmEs6i3mB/fzuuL21f+ej2CTnCF0QZCqdZaBhybqNF7IkAXiWx8kzI2AMCwv\nMhMrHwMZW5S9uVxCGyh+nWUPAtZaiGV3US0GpQYAdaR1tC/e17ma4HY6Z+Jfscgt\nMhhjU8hUz0Lxn5vI+NntwLSpvfM3C10T1pI1kzVA9GbeVpoSY6oSroph8vvSAkdH\nytRuNEqTAgMBAAECggEBAMKvCYXn+bFXWLd/+z7OKlOTNpbWxN/xqCBHJB0N01d+\nB36JNsjl6V+sUF+BT9FOIFlPQpRlo34kZ7AmsYaN/eIsGmMcZVVTrs9+OZN8DhOL\n57adYEMQ0d34xkRubu4bee2ewfT24kfsCC55x3Xym09E8gOXqo5+iICL4I1InrjF\nFeNISeJRMDy8t3KAjGeFLmZY7hJ6/vXQeug4p7/+y9TkcfFacCp2BDUboWNRE15c\nx1BDYydCZoOXMH8iqMN0XaLPVhWFmvR6rnxAZpJgZ6r6c+bb15ojNW+i3JhCXMHb\nerG5kYtDwgyzpOBKCjCPZxLKg3cJvFdlZrxTAQsNdckCgYEA+dPQ7Qmomx+pS3jc\n/hyRPx4xQdK2bIqembJp1hpp7xuNE87lxBGeOddmzV0TbrMqA1Owzi+DOlLn1ICf\nYMZqJD8oTr71yq02ATlRkW1MNc5zmSeA6WdLxPsbWbzy/QgA02CarWoHwvm7mgZn\nCw0ZTzvHc/Ipu007+It7uDtsvn8CgYEA5SCTd3BHmRbpf6dpaLPGy49Uc8oA+3Qd\nhMF9Qcunf5qw9ztfS4V0pI8s+vwCLEvgVrGwxDjDXcdKGARSK5dxVWviUpfJrvTq\naHpPEa2JulcUXZBRZDANdg6nQaJqwlZuUWrABI4liARygIMA7Glzpklt92fzskfH\nQOxQoSBeke0CgYEA1Mo64Tth1kcAft1CdlrEyFsiH2unoAnuDwGtLgUvh88SufV3\nNSrAd4nl8TO/EoIeXdkR9nz3rFzjQ9gOaHJ4A8mbvn7egjRIlIBK3rCWwhnH0oKY\nRbWLDwvG/wd2fFktwt08wkpWtBbcWNPtPrd4gEltmG+CZhvh4dCEn6ZV+GcCgYBG\nXfXMBZiHhIjbYm+17xhLZc5a7RvWHbf/EGlGbqQXRUu58er3R5ol+66lugV00yyn\nk1SlPoWJZG316EXQC2eMA2DzWphe+eqPgZiM5k3ZA2tGvM6yRSutKRzmxFmjK2Yf\n7PfhrkIKfssnepQrBsu0svJpu+wUwYSJBMpSYZ2JlQKBgQD2kU04Hi+R1nUW7NsU\nyxrzPYYhI9XvFxKZJ0JUiSdO/yQB2E+b8EpSm6A/v2wuKCS2BvuoXYBkYgvwi/0c\nCxXROveqFKru8jUkLZ1g/qjOw2JOsZncCJAbYoLl6uZ1+TqrQhIQwmEVHe0Ltw9t\nASrg7sLU04Ck1CXYtx/WkpZOKQ==\n-----END PRIVATE KEY-----\n',
  client_email: __DEV__ ? 'firebase-adminsdk-1gysd@sns-chat-dev.iam.gserviceaccount.com' : 'firebase-adminsdk-1gt28@snschat-fb64b.iam.gserviceaccount.com',
  client_id: __DEV__ ? '118444229404027110527' : '100137623575146372755',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://accounts.google.com/o/oauth2/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: __DEV__ ? 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-1gysd%40sns-chat-dev.iam.gserviceaccount.com'
    : 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-1gt28%40snschat-fb64b.iam.gserviceaccount.com',
};
export const auth = {
  jwt: { secret: process.env.JWT_SECRET || 'React Starter Kit' },
};
