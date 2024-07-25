USE CitizenConnect360KE;

CREATE OR ALTER PROCEDURE getActivatedPasswordReset

AS
BEGIN 
SELECT * FROM users WHERE passwordReset=1
END;

GO;