import { useState } from "react";
import styled from "styled-components";
import { validateAddrInput } from "../apis/address";
import MiddleElipses from "react-middle-ellipsis";

const Input = styled.input`
  width: calc(100% - 30px);
  font-size: 1.2em;
  padding: 15px;
  border-radius: 10px;
  border: none;
  background-color: #f7f7f7;
`;

const InputBox = styled.div`
  width: 50%;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
`;

const EthTitle = styled.h3`
  margin: 0;
  margin-bottom: 25px;
  align-self: flex-start;
  font-weight: 500;
`;

const ProfileBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: calc(100% - 40px);
  margin-top: 10px;
  background-color: #f2f2f2;
  border-radius: 10px;
`;

const ProfileBoxInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  & > div:first-child {
    font-weight: bolder;
  }
`;

const ProfileBoxInfoText = styled.p`
  margin: 0;
  padding: 0;
`;

const ProfileBoxAvatar = styled.img`
  height: 100%;
  max-height: 50px;
  border-radius: 10px;
  margin-right: 20px;
`;

const ErrorBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #fff2f2;
  width: calc(100% - 40px);
  border-radius: 10px;
  border: 2px solid #ffd1d1;
  margin-top: 10px;
  padding: 0 20px;
`;

const WarningBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #fffeed;
  width: calc(100% - 40px);
  border-radius: 10px;
  border: 2px solid #fffcc7;
  margin-top: 10px;
  padding: 0 20px;
`;

export function EthAddressInput(props) {
  const { callback } = props;
  const [value, setValue] = useState("");
  const [profile, setProfile] = useState(null);
  const [checkTimeout, setCheckTimeout] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (newValue) => {
    setValue(newValue);
    setError(null);
    setProfile(null);
    if (checkTimeout) {
      clearTimeout(checkTimeout);
    }
    setCheckTimeout(
      setTimeout(() => {
        validateAddrInput(newValue)
          .then((res) => [setProfile(res), callback(res)])
          .catch((err) => [setProfile(null), setError(err)]);
      }, 1500)
    );
  };

  return (
    <InputBox>
      <EthTitle>Enter an ETH Address or ENS Name</EthTitle>
      <Input
        value={value}
        placeholder="nick.eth"
        onChange={(e) => handleChange(e.target.value)}
      />
      {error && (
        <ErrorBox>
          <p>{error.message}</p>
        </ErrorBox>
      )}
      {profile && profile.warning && (
        <WarningBox>
          <p>{profile.warning}</p>
        </WarningBox>
      )}
      {profile && (
        <ProfileBox>
          {profile.avatar && <ProfileBoxAvatar src={profile.avatar.url} />}
          <ProfileBoxInfo>
            {profile.name && (
              <MiddleElipses>
                <ProfileBoxInfoText>{profile.name}</ProfileBoxInfoText>
              </MiddleElipses>
            )}
            {profile.address && (
              <MiddleElipses>
                <ProfileBoxInfoText>{profile.address}</ProfileBoxInfoText>
              </MiddleElipses>
            )}
          </ProfileBoxInfo>
        </ProfileBox>
      )}
    </InputBox>
  );
}
